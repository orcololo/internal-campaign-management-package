import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';

export class QueryVotersDto {
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
  @Max(1000) // Allow up to 1000 for map views
  limit?: number = 10;

  // Sorting
  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ['name', 'email', 'city', 'state', 'supportLevel', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  // Search
  @ApiPropertyOptional({ description: 'Search by name or CPF', example: 'João' })
  @IsOptional()
  @IsString()
  search?: string;

  // Location filters
  @ApiPropertyOptional({ description: 'Filter by city', example: 'São Paulo' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filter by state', example: 'SP' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by neighborhood', example: 'Centro' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  // Electoral filters
  @ApiPropertyOptional({ description: 'Filter by electoral zone', example: '001' })
  @IsOptional()
  @IsString()
  electoralZone?: string;

  @ApiPropertyOptional({ description: 'Filter by electoral section', example: '0123' })
  @IsOptional()
  @IsString()
  electoralSection?: string;

  // Demographic filters
  @ApiPropertyOptional({
    description: 'Filter by gender',
    enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'],
  })
  @IsOptional()
  @IsEnum(['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'])
  gender?: string;

  @ApiPropertyOptional({
    description: 'Filter by education level',
    enum: [
      'FUNDAMENTAL_INCOMPLETO',
      'FUNDAMENTAL_COMPLETO',
      'MEDIO_INCOMPLETO',
      'MEDIO_COMPLETO',
      'SUPERIOR_INCOMPLETO',
      'SUPERIOR_COMPLETO',
      'POS_GRADUACAO',
      'NAO_INFORMADO',
    ],
  })
  @IsOptional()
  @IsEnum([
    'FUNDAMENTAL_INCOMPLETO',
    'FUNDAMENTAL_COMPLETO',
    'MEDIO_INCOMPLETO',
    'MEDIO_COMPLETO',
    'SUPERIOR_INCOMPLETO',
    'SUPERIOR_COMPLETO',
    'POS_GRADUACAO',
    'NAO_INFORMADO',
  ])
  educationLevel?: string;

  @ApiPropertyOptional({
    description: 'Filter by income level',
    enum: [
      'ATE_1_SALARIO',
      'DE_1_A_2_SALARIOS',
      'DE_2_A_5_SALARIOS',
      'DE_5_A_10_SALARIOS',
      'ACIMA_10_SALARIOS',
      'NAO_INFORMADO',
    ],
  })
  @IsOptional()
  @IsEnum([
    'ATE_1_SALARIO',
    'DE_1_A_2_SALARIOS',
    'DE_2_A_5_SALARIOS',
    'DE_5_A_10_SALARIOS',
    'ACIMA_10_SALARIOS',
    'NAO_INFORMADO',
  ])
  incomeLevel?: string;

  @ApiPropertyOptional({
    description: 'Filter by marital status',
    enum: ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'],
  })
  @IsOptional()
  @IsEnum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'])
  maritalStatus?: string;

  // Political filters
  @ApiPropertyOptional({
    description: 'Filter by support level',
    enum: [
      'MUITO_FAVORAVEL',
      'FAVORAVEL',
      'NEUTRO',
      'DESFAVORAVEL',
      'MUITO_DESFAVORAVEL',
      'NAO_DEFINIDO',
    ],
  })
  @IsOptional()
  @IsEnum([
    'MUITO_FAVORAVEL',
    'FAVORAVEL',
    'NEUTRO',
    'DESFAVORAVEL',
    'MUITO_DESFAVORAVEL',
    'NAO_DEFINIDO',
  ])
  supportLevel?: string;

  @ApiPropertyOptional({ description: 'Filter by occupation', example: 'Professor' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ description: 'Filter by religion', example: 'Católica' })
  @IsOptional()
  @IsString()
  religion?: string;

  // Contact filters
  @ApiPropertyOptional({
    description: 'Filter by WhatsApp availability',
    enum: ['SIM', 'NAO'],
  })
  @IsOptional()
  @IsEnum(['SIM', 'NAO'])
  hasWhatsapp?: string;
}
