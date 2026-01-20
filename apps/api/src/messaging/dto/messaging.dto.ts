import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateTemplateDto {
    @ApiProperty({ description: 'Template name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: ['utility', 'marketing', 'authentication'] })
    @IsEnum(['utility', 'marketing', 'authentication'])
    category: 'utility' | 'marketing' | 'authentication';

    @ApiProperty({ description: 'Message content with {{variable}} placeholders' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ description: 'Variable names used in content', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    variables?: string[];
}

export class UpdateTemplateDto {
    @ApiPropertyOptional({ description: 'Template name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Message content' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    variables?: string[];
}

export class CreateCampaignDto {
    @ApiProperty({ description: 'Campaign name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Template ID to use' })
    @IsString()
    @IsNotEmpty()
    templateId: string;

    @ApiPropertyOptional({ description: 'Voter segment filters' })
    @IsOptional()
    segmentFilters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Scheduled datetime (ISO 8601)' })
    @IsOptional()
    @IsString()
    scheduledAt?: string;
}

export class SendCampaignDto {
    @ApiPropertyOptional({ description: 'Send immediately instead of scheduling' })
    @IsOptional()
    immediate?: boolean;
}
