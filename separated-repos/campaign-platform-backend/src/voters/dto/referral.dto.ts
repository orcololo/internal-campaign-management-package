import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SupportLevel } from '../../database/schemas/voter.schema';

/**
 * DTO for registering a new voter via referral code
 *
 * Used when someone clicks on a referral link and signs up
 */
export class CreateReferralDto {
  @ApiProperty({
    description: 'Referral code from the referring voter',
    example: 'JOAO-SILVA-AB12CD',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  referralCode: string;

  @ApiProperty({
    description: 'Full name of the new voter',
    example: 'Maria Santos',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'maria.santos@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '(11) 98765-4321',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp number',
    example: '(11) 98765-4321',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'State (2-letter code)',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;

  @ApiPropertyOptional({
    description: 'Support level for the campaign',
    enum: [
      'MUITO_FAVORAVEL',
      'FAVORAVEL',
      'NEUTRO',
      'DESFAVORAVEL',
      'MUITO_DESFAVORAVEL',
      'NAO_DEFINIDO',
    ],
    example: 'FAVORAVEL',
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
  supportLevel?: SupportLevel;
}

/**
 * Referral statistics response DTO
 *
 * Returned when querying /voters/:id/referral-stats
 */
export class ReferralStatsDto {
  @ApiProperty({
    description: 'Total number of referred voters',
    example: 15,
  })
  total: number;

  @ApiProperty({
    description: 'Number of active (non-deleted) referred voters',
    example: 14,
  })
  active: number;

  @ApiProperty({
    description: 'Number of referrals this month',
    example: 3,
  })
  thisMonth: number;

  @ApiProperty({
    description: 'Breakdown of referred voters by support level',
    example: {
      MUITO_FAVORAVEL: 5,
      FAVORAVEL: 8,
      NEUTRO: 1,
      NAO_DEFINIDO: 1,
    },
  })
  byLevel: Record<string, number>;
}

/**
 * Referral code response DTO
 */
export class ReferralCodeDto {
  @ApiProperty({
    description: 'Unique referral code',
    example: 'JOAO-SILVA-AB12CD',
  })
  referralCode: string;

  @ApiProperty({
    description: 'Full referral URL',
    example: 'https://app.eleicoes.com/cadastro?ref=JOAO-SILVA-AB12CD',
  })
  referralUrl: string;
}

/**
 * Query DTO for referrals list
 */
export class QueryReferralsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage?: number = 20;

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
  supportLevel?: SupportLevel;
}
