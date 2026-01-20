import { CreateReportDto } from './create-report.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterDto, SortDto } from './create-report.dto';

export class UpdateReportDto {
  @ApiPropertyOptional({
    description: 'Report name',
    example: 'Eleitores Favoráveis - Janeiro 2026 (Atualizado)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Report description',
    example: 'Relatório atualizado com novos filtros',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of filters to apply',
    type: [FilterDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiPropertyOptional({
    description: 'Array of sort rules',
    type: [SortDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sorting?: SortDto[];

  @ApiPropertyOptional({
    description: 'Array of field names to include in report',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @ApiPropertyOptional({
    description: 'Whether this report is public',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
