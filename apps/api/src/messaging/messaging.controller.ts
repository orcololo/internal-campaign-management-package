import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CampaignsService } from './campaigns.service';
import { CreateTemplateDto, UpdateTemplateDto, CreateCampaignDto } from './dto/messaging.dto';

@ApiTags('Messaging')
@Controller('messaging')
export class MessagingController {
    constructor(
        private readonly templatesService: TemplatesService,
        private readonly campaignsService: CampaignsService,
    ) { }

    // ==================== TEMPLATES ====================

    @Post('templates')
    @ApiOperation({ summary: 'Create message template' })
    @ApiResponse({ status: 201, description: 'Template created' })
    async createTemplate(@Body() dto: CreateTemplateDto) {
        return this.templatesService.create(dto);
    }

    @Get('templates')
    @ApiOperation({ summary: 'List all templates' })
    @ApiResponse({ status: 200, description: 'List of templates' })
    async listTemplates() {
        return this.templatesService.findAll();
    }

    @Get('templates/:id')
    @ApiOperation({ summary: 'Get template by ID' })
    @ApiResponse({ status: 200, description: 'Template details' })
    async getTemplate(@Param('id') id: string) {
        return this.templatesService.findOne(id);
    }

    @Put('templates/:id')
    @ApiOperation({ summary: 'Update template' })
    @ApiResponse({ status: 200, description: 'Template updated' })
    async updateTemplate(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
        return this.templatesService.update(id, dto);
    }

    @Delete('templates/:id')
    @ApiOperation({ summary: 'Delete template' })
    @ApiResponse({ status: 200, description: 'Template deleted' })
    async deleteTemplate(@Param('id') id: string) {
        return this.templatesService.delete(id);
    }

    @Post('templates/:id/submit')
    @ApiOperation({ summary: 'Submit template for WhatsApp approval' })
    @ApiResponse({ status: 200, description: 'Template submitted' })
    async submitTemplate(@Param('id') id: string) {
        return this.templatesService.submitForApproval(id);
    }

    // ==================== CAMPAIGNS ====================

    @Post('campaigns')
    @ApiOperation({ summary: 'Create messaging campaign' })
    @ApiResponse({ status: 201, description: 'Campaign created' })
    async createCampaign(@Body() dto: CreateCampaignDto) {
        return this.campaignsService.create(dto);
    }

    @Get('campaigns')
    @ApiOperation({ summary: 'List all campaigns' })
    @ApiResponse({ status: 200, description: 'List of campaigns' })
    async listCampaigns() {
        return this.campaignsService.findAll();
    }

    @Get('campaigns/:id')
    @ApiOperation({ summary: 'Get campaign with details' })
    @ApiResponse({ status: 200, description: 'Campaign details' })
    async getCampaign(@Param('id') id: string) {
        return this.campaignsService.findOneWithDetails(id);
    }

    @Post('campaigns/:id/schedule')
    @ApiOperation({ summary: 'Schedule campaign for later' })
    @ApiResponse({ status: 200, description: 'Campaign scheduled' })
    async scheduleCampaign(
        @Param('id') id: string,
        @Body() body: { scheduledAt: string },
    ) {
        return this.campaignsService.schedule(id, new Date(body.scheduledAt));
    }

    @Post('campaigns/:id/send')
    @ApiOperation({ summary: 'Send campaign immediately' })
    @ApiResponse({ status: 200, description: 'Campaign sent' })
    async sendCampaign(@Param('id') id: string) {
        return this.campaignsService.sendNow(id);
    }

    @Post('campaigns/:id/cancel')
    @ApiOperation({ summary: 'Cancel campaign' })
    @ApiResponse({ status: 200, description: 'Campaign cancelled' })
    async cancelCampaign(@Param('id') id: string) {
        return this.campaignsService.cancel(id);
    }

    @Get('campaigns/:id/logs')
    @ApiOperation({ summary: 'Get message logs for campaign' })
    @ApiResponse({ status: 200, description: 'Message logs' })
    async getCampaignLogs(
        @Param('id') id: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.campaignsService.getMessageLogs(id, page, limit);
    }
}
