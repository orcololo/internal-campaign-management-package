import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

export class CreateVoterDto {
  // Basic Information
  @ApiProperty({ description: 'Full name of the voter', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'CPF (Brazilian ID)', example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF must be in format: 000.000.000-00',
  })
  cpf?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1985-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'],
    example: 'MASCULINO',
  })
  @IsOptional()
  @IsEnum(['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'])
  gender?: string;

  // Contact Information
  @ApiPropertyOptional({ description: 'Phone number', example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'WhatsApp number', example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'joao@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  // Address Information
  @ApiPropertyOptional({ description: 'Street address', example: 'Rua das Flores' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Address number', example: '123' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  addressNumber?: string;

  @ApiPropertyOptional({ description: 'Address complement', example: 'Apto 45' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressComplement?: string;

  @ApiPropertyOptional({ description: 'Neighborhood', example: 'Centro' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;

  @ApiPropertyOptional({ description: 'City', example: 'São Paulo' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State code', example: 'SP' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code', example: '01234-567' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Latitude', example: -23.5505 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude', example: -46.6333 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  // Electoral Information
  @ApiPropertyOptional({ description: 'Electoral title number', example: '1234 5678 9012' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  electoralTitle?: string;

  @ApiPropertyOptional({ description: 'Electoral zone', example: '001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  electoralZone?: string;

  @ApiPropertyOptional({ description: 'Electoral section', example: '0123' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  electoralSection?: string;

  @ApiPropertyOptional({ description: 'Voting location', example: 'Escola Municipal Central' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  votingLocation?: string;

  // Social Segmentation
  @ApiPropertyOptional({
    description: 'Education level',
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
    example: 'SUPERIOR_COMPLETO',
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

  @ApiPropertyOptional({ description: 'Occupation/Profession', example: 'Professor' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  occupation?: string;

  @ApiPropertyOptional({
    description: 'Income level',
    enum: [
      'ATE_1_SALARIO',
      'DE_1_A_2_SALARIOS',
      'DE_2_A_5_SALARIOS',
      'DE_5_A_10_SALARIOS',
      'ACIMA_10_SALARIOS',
      'NAO_INFORMADO',
    ],
    example: 'DE_2_A_5_SALARIOS',
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
    description: 'Marital status',
    enum: ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'],
    example: 'CASADO',
  })
  @IsOptional()
  @IsEnum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'])
  maritalStatus?: string;

  @ApiPropertyOptional({ description: 'Religion', example: 'Católica' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  religion?: string;

  @ApiPropertyOptional({ description: 'Ethnicity/Race', example: 'Parda' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ethnicity?: string;

  // Social Media
  @ApiPropertyOptional({ description: 'Facebook profile', example: 'facebook.com/joaosilva' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  facebook?: string;

  @ApiPropertyOptional({ description: 'Instagram handle', example: '@joaosilva' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  instagram?: string;

  @ApiPropertyOptional({ description: 'Twitter/X handle', example: '@joaosilva' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  twitter?: string;

  // Political Information
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
  supportLevel?: string;

  @ApiPropertyOptional({ description: 'Political party affiliation', example: 'PT' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  politicalParty?: string;

  @ApiPropertyOptional({
    description: 'Voting history notes',
    example: 'Voted in last 3 elections',
  })
  @IsOptional()
  @IsString()
  votingHistory?: string;

  // Additional Information
  @ApiPropertyOptional({ description: 'Number of family members', example: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  familyMembers?: number;

  @ApiPropertyOptional({ description: 'Has WhatsApp?', enum: ['SIM', 'NAO'], example: 'SIM' })
  @IsOptional()
  @IsEnum(['SIM', 'NAO'])
  hasWhatsapp?: string;

  @ApiPropertyOptional({
    description: 'Preferred contact method',
    enum: ['TELEFONE', 'WHATSAPP', 'EMAIL'],
    example: 'WHATSAPP',
  })
  @IsOptional()
  @IsEnum(['TELEFONE', 'WHATSAPP', 'EMAIL'])
  preferredContact?: string;

  @ApiPropertyOptional({ description: 'Additional notes', example: 'Contact in the morning' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorization (JSON array)',
    example: '["lideranca_local", "apoiador"]',
  })
  @IsOptional()
  @IsString()
  tags?: string;
}
