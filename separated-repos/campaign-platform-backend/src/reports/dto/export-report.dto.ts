import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
}

export class ExportReportDto {
  @ApiProperty({
    enum: ExportFormat,
    description: 'Export format',
    example: ExportFormat.PDF,
  })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({
    description: 'Include summary statistics in export',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeSummary?: boolean = true;

  @ApiProperty({
    description: 'Include auto-filters in Excel export',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeFilters?: boolean = true;
}
