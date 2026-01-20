import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import {
    messageTemplates,
    TemplateCategory,
    TemplateStatus,
    NewMessageTemplate,
} from '../database/schemas';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/messaging.dto';

// Mock user ID until auth is implemented
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

@Injectable()
export class TemplatesService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Create a new message template
     */
    async create(dto: CreateTemplateDto) {
        const db = this.databaseService.getDb();

        const result = await db
            .insert(messageTemplates)
            .values({
                name: dto.name,
                category: dto.category as TemplateCategory,
                content: dto.content,
                variables: dto.variables,
                createdBy: MOCK_USER_ID,
            })
            .returning();

        return result[0];
    }

    /**
     * Find all templates
     */
    async findAll() {
        const db = this.databaseService.getDb();

        return db
            .select()
            .from(messageTemplates)
            .orderBy(desc(messageTemplates.createdAt));
    }

    /**
     * Find template by ID
     */
    async findOne(id: string) {
        const db = this.databaseService.getDb();

        const result = await db
            .select()
            .from(messageTemplates)
            .where(eq(messageTemplates.id, id));

        if (!result[0]) {
            throw new NotFoundException(`Template ${id} not found`);
        }

        return result[0];
    }

    /**
     * Update template
     */
    async update(id: string, dto: UpdateTemplateDto) {
        const db = this.databaseService.getDb();

        await this.findOne(id); // Verify exists

        const result = await db
            .update(messageTemplates)
            .set({
                ...dto,
                updatedAt: new Date(),
            })
            .where(eq(messageTemplates.id, id))
            .returning();

        return result[0];
    }

    /**
     * Delete template
     */
    async delete(id: string) {
        const db = this.databaseService.getDb();

        await this.findOne(id); // Verify exists

        await db.delete(messageTemplates).where(eq(messageTemplates.id, id));

        return { success: true };
    }

    /**
     * Submit template to WhatsApp for approval
     * Note: This is a placeholder - actual implementation requires Meta API integration
     */
    async submitForApproval(id: string) {
        const db = this.databaseService.getDb();

        const template = await this.findOne(id);

        // In real implementation, this would:
        // 1. Call Meta Graph API to create/update template
        // 2. Store the whatsappTemplateId from response
        // 3. Set status to 'pending'

        const result = await db
            .update(messageTemplates)
            .set({
                status: 'pending' as TemplateStatus,
                updatedAt: new Date(),
            })
            .where(eq(messageTemplates.id, id))
            .returning();

        return result[0];
    }

    /**
     * Parse content and extract variable placeholders
     */
    extractVariables(content: string): string[] {
        const matches = content.match(/\{\{(\w+)\}\}/g) || [];
        return [...new Set(matches.map((m) => m.replace(/[{}]/g, '')))];
    }

    /**
     * Replace variables in template content
     */
    renderContent(content: string, variables: Record<string, string>): string {
        let rendered = content;
        for (const [key, value] of Object.entries(variables)) {
            rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        }
        return rendered;
    }
}
