import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ReportFilter, ReportSort } from '@/database/schemas/saved-report.schema';

// Enums from schema
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IN = 'in',
  NOT_IN = 'not_in',
  GREATER_THAN = 'greater_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN = 'less_than',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  BETWEEN = 'between',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterDto {
  @ApiProperty({
    description: 'Field name to filter on',
    example: 'supportLevel',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Filter operator',
    enum: FilterOperator,
    example: FilterOperator.EQUALS,
  })
  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @ApiProperty({
    description: 'Filter value (can be string, number, boolean, or array)',
    example: 'FAVORAVEL',
  })
  value: any;
}

export class SortDto {
  @ApiProperty({
    description: 'Field name to sort by',
    example: 'name',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Sort direction',
    enum: SortDirection,
    example: SortDirection.ASC,
  })
  @IsEnum(SortDirection)
  direction: SortDirection;
}

export class CreateReportDto {
  @ApiProperty({
    description: 'Report name',
    example: 'Eleitores Favoráveis - Janeiro 2026',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Report description',
    example: 'Relatório de eleitores com nível de apoio favorável',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of filters to apply',
    type: [FilterDto],
    example: [
      {
        field: 'supportLevel',
        operator: 'equals',
        value: 'FAVORAVEL',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiPropertyOptional({
    description: 'Array of sort rules',
    type: [SortDto],
    example: [
      {
        field: 'name',
        direction: 'asc',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sorting?: SortDto[];

  @ApiPropertyOptional({
    description: 'Array of field names to include in report',
    type: [String],
    example: ['name', 'email', 'phone', 'supportLevel', 'city', 'state'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @ApiPropertyOptional({
    description: 'Whether this report is public',
    example: false,
  })
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Scheduling configuration (cron expression)',
    example: '0 9 * * 1',
  })
  @IsOptional()
  @IsString()
  scheduleConfig?: string;
}
