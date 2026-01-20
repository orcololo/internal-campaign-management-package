import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAuditLogsDto {
    @ApiPropertyOptional({ description: 'Filter by user ID' })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({ description: 'Filter by entity type' })
    @IsOptional()
    @IsString()
    entityType?: string;

    @ApiPropertyOptional({ description: 'Filter by entity ID' })
    @IsOptional()
    @IsUUID()
    entityId?: string;

    @ApiPropertyOptional({ description: 'Filter by action' })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiPropertyOptional({ description: 'Filter from date (ISO 8601)' })
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @ApiPropertyOptional({ description: 'Filter to date (ISO 8601)' })
    @IsOptional()
    @IsDateString()
    toDate?: string;

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 50 })
    @IsOptional()
    @Type(() => Number)
    limit?: number = 50;
}
