import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, desc, sql, isNull, gte, lte } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import {
    messagingCampaigns,
    messageLogs,
    messageTemplates,
    voters,
    CampaignStatus,
    MessageStatus,
} from '../database/schemas';
import { CreateCampaignDto } from './dto/messaging.dto';
import { TemplatesService } from './templates.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

// Mock user ID until auth is implemented
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

@Injectable()
export class CampaignsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly templatesService: TemplatesService,
        private readonly notificationsService: NotificationsService,
        private readonly notificationsGateway: NotificationsGateway,
    ) { }

    /**
     * Create a new campaign
     */
    async create(dto: CreateCampaignDto) {
        const db = this.databaseService.getDb();

        // Verify template exists
        const template = await this.templatesService.findOne(dto.templateId);

        const result = await db
            .insert(messagingCampaigns)
            .values({
                name: dto.name,
                templateId: dto.templateId,
                segmentFilters: dto.segmentFilters,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                createdBy: MOCK_USER_ID,
            })
            .returning();

        return result[0];
    }

    /**
     * Find all campaigns
     */
    async findAll() {
        const db = this.databaseService.getDb();

        return db
            .select()
            .from(messagingCampaigns)
            .orderBy(desc(messagingCampaigns.createdAt));
    }

    /**
     * Find campaign by ID with stats
     */
    async findOne(id: string) {
        const db = this.databaseService.getDb();

        const result = await db
            .select()
            .from(messagingCampaigns)
            .where(eq(messagingCampaigns.id, id));

        if (!result[0]) {
            throw new NotFoundException(`Campaign ${id} not found`);
        }

        return result[0];
    }

    /**
     * Get campaign with template details
     */
    async findOneWithDetails(id: string) {
        const db = this.databaseService.getDb();

        const campaign = await this.findOne(id);
        const template = await this.templatesService.findOne(campaign.templateId);

        // Get message stats
        const stats = await db
            .select({
                status: messageLogs.status,
                count: sql<number>`count(*)`,
            })
            .from(messageLogs)
            .where(eq(messageLogs.campaignId, id))
            .groupBy(messageLogs.status);

        return {
            ...campaign,
            template,
            stats: stats.reduce(
                (acc, s) => ({ ...acc, [s.status]: Number(s.count) }),
                {} as Record<string, number>,
            ),
        };
    }

    /**
     * Schedule campaign for later
     */
    async schedule(id: string, scheduledAt: Date) {
        const db = this.databaseService.getDb();

        const campaign = await this.findOne(id);

        if (campaign.status !== 'draft') {
            throw new BadRequestException('Can only schedule draft campaigns');
        }

        const result = await db
            .update(messagingCampaigns)
            .set({
                scheduledAt,
                status: 'scheduled' as CampaignStatus,
                updatedAt: new Date(),
            })
            .where(eq(messagingCampaigns.id, id))
            .returning();

        return result[0];
    }

    /**
     * Send campaign immediately
     * Note: This is a simplified version - production would use Bull queue
     */
    async sendNow(id: string) {
        const db = this.databaseService.getDb();

        const campaign = await this.findOne(id);

        if (!['draft', 'scheduled'].includes(campaign.status)) {
            throw new BadRequestException('Campaign cannot be sent in current status');
        }

        // Get template
        const template = await this.templatesService.findOne(campaign.templateId);

        if (template.status !== 'approved' && template.status !== 'draft') {
            throw new BadRequestException('Template must be approved for sending');
        }

        // Get target voters based on segment filters
        const votersList = await this.getTargetVoters(campaign.segmentFilters);

        // Update campaign status
        await db
            .update(messagingCampaigns)
            .set({
                status: 'running' as CampaignStatus,
                startedAt: new Date(),
                totalRecipients: votersList.length,
                updatedAt: new Date(),
            })
            .where(eq(messagingCampaigns.id, id));

        // Create message logs for each voter
        let sentCount = 0;
        let failedCount = 0;

        for (const voter of votersList) {
            if (!voter.whatsapp && !voter.phone) {
                failedCount++;
                continue;
            }

            const phone = voter.whatsapp || voter.phone;

            // Render content with voter data
            const content = this.templatesService.renderContent(template.content, {
                name: voter.name,
                // Add more variables as needed
            });

            // Create message log
            await db.insert(messageLogs).values({
                campaignId: id,
                voterId: voter.id,
                channel: 'whatsapp',
                phone: phone!,
                content,
                status: 'pending' as MessageStatus,
            });

            // In production, this would call WhatsApp Business API here
            // For now, mark as sent
            sentCount++;
        }

        // Update final stats
        const finalStatus = failedCount === votersList.length ? 'failed' : 'completed';

        await db
            .update(messagingCampaigns)
            .set({
                status: finalStatus as CampaignStatus,
                completedAt: new Date(),
                sentCount,
                failedCount,
                updatedAt: new Date(),
            })
            .where(eq(messagingCampaigns.id, id));

        // Send notification
        await this.notificationsService.create({
            userId: MOCK_USER_ID,
            type: 'campaign_complete',
            title: `Campanha "${campaign.name}" finalizada`,
            message: `${sentCount} mensagens enviadas, ${failedCount} falhas`,
            link: `/messaging/campaigns/${id}`,
        });

        // Send real-time notification
        await this.notificationsGateway.sendToUser(MOCK_USER_ID, {
            id: 'new',
            type: 'campaign_complete',
            title: `Campanha "${campaign.name}" finalizada`,
            message: `${sentCount} mensagens enviadas`,
            createdAt: new Date(),
        });

        return this.findOneWithDetails(id);
    }

    /**
     * Cancel campaign
     */
    async cancel(id: string) {
        const db = this.databaseService.getDb();

        const campaign = await this.findOne(id);

        if (!['draft', 'scheduled', 'running'].includes(campaign.status)) {
            throw new BadRequestException('Campaign cannot be cancelled');
        }

        const result = await db
            .update(messagingCampaigns)
            .set({
                status: 'cancelled' as CampaignStatus,
                updatedAt: new Date(),
            })
            .where(eq(messagingCampaigns.id, id))
            .returning();

        return result[0];
    }

    /**
     * Get message logs for campaign
     */
    async getMessageLogs(campaignId: string, page = 1, limit = 50) {
        const db = this.databaseService.getDb();
        const offset = (page - 1) * limit;

        const logs = await db
            .select()
            .from(messageLogs)
            .where(eq(messageLogs.campaignId, campaignId))
            .orderBy(desc(messageLogs.createdAt))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(messageLogs)
            .where(eq(messageLogs.campaignId, campaignId));

        return {
            data: logs,
            meta: {
                total: Number(countResult[0]?.count || 0),
                page,
                limit,
            },
        };
    }

    /**
     * Get target voters based on segment filters
     */
    private async getTargetVoters(filters: any) {
        const db = this.databaseService.getDb();

        // Build conditions based on filters
        const conditions: any[] = [isNull(voters.deletedAt)];

        if (filters?.supportLevel) {
            conditions.push(eq(voters.supportLevel, filters.supportLevel));
        }
        if (filters?.city) {
            conditions.push(eq(voters.city, filters.city));
        }
        if (filters?.state) {
            conditions.push(eq(voters.state, filters.state));
        }

        return db
            .select({ id: voters.id, name: voters.name, phone: voters.phone, whatsapp: voters.whatsapp })
            .from(voters)
            .where(and(...conditions))
            .limit(1000); // Safety limit
    }
}
