import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum, IsDateString } from 'class-validator';

export class QueryEventsDto {
  // Pagination
  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Search
  @ApiPropertyOptional({ description: 'Search by title or location', example: 'Comício' })
  @IsOptional()
  @IsString()
  search?: string;

  // Type filter
  @ApiPropertyOptional({
    description: 'Filter by event type',
    enum: [
      'COMICIO',
      'REUNIAO',
      'VISITA',
      'ENTREVISTA',
      'DEBATE',
      'CAMINHADA',
      'CORPO_A_CORPO',
      'EVENTO_PRIVADO',
      'OUTRO',
    ],
  })
  @IsOptional()
  @IsEnum([
    'COMICIO',
    'REUNIAO',
    'VISITA',
    'ENTREVISTA',
    'DEBATE',
    'CAMINHADA',
    'CORPO_A_CORPO',
    'EVENTO_PRIVADO',
    'OUTRO',
  ])
  type?: string;

  // Status filter
  @ApiPropertyOptional({
    description: 'Filter by event status',
    enum: ['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'],
  })
  @IsOptional()
  @IsEnum(['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'])
  status?: string;

  // Visibility filter
  @ApiPropertyOptional({
    description: 'Filter by visibility',
    enum: ['PUBLICO', 'PRIVADO', 'INTERNO'],
  })
  @IsOptional()
  @IsEnum(['PUBLICO', 'PRIVADO', 'INTERNO'])
  visibility?: string;

  // Date filters
  @ApiPropertyOptional({
    description: 'Filter events starting from this date',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter events starting until this date',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  // Location filter
  @ApiPropertyOptional({ description: 'Filter by city', example: 'São Paulo' })
  @IsOptional()
  @IsString()
  city?: string;
}
