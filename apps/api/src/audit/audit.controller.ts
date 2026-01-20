import { Controller, Get, Query, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuditService } from './audit.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';
import { AuditEntity } from '../database/schemas';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @ApiOperation({ summary: 'List audit logs with filtering' })
    @ApiResponse({ status: 200, description: 'List of audit logs' })
    async findAll(@Query() query: QueryAuditLogsDto) {
        return this.auditService.findAll(query);
    }

    @Get('export')
    @ApiOperation({ summary: 'Export audit logs to CSV' })
    @ApiResponse({ status: 200, description: 'CSV file download' })
    async exportCsv(@Query() query: QueryAuditLogsDto, @Res() res: Response) {
        const csv = await this.auditService.exportToCsv(query);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
        res.send(csv);
    }

    @Get('entity/:type/:id')
    @ApiOperation({ summary: 'Get audit logs for a specific entity' })
    @ApiResponse({ status: 200, description: 'Audit logs for entity' })
    async findByEntity(@Param('type') type: string, @Param('id') id: string) {
        return this.auditService.findByEntity(type as AuditEntity, id);
    }

    @Get('user/:id')
    @ApiOperation({ summary: 'Get audit logs for a specific user' })
    @ApiResponse({ status: 200, description: 'Audit logs for user' })
    async findByUser(@Param('id') userId: string) {
        return this.auditService.findByUser(userId);
    }
}
