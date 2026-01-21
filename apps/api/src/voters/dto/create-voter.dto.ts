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
  IsArray,
  IsObject,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVoterDto {
  // Basic Information
  @ApiProperty({ description: 'Full name of the voter', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Mother\'s name', example: 'Maria da Silva' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  motherName?: string;

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
  @Transform(({ value }) => (value === '' ? undefined : value))
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
  @Transform(({ value }) => (value === '' ? undefined : value))
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

  @ApiPropertyOptional({ description: 'Top issues', example: '["Education", "Health"]' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    // Handle string-encoded arrays
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length === 0) return undefined;
        return parsed;
      } catch {
        return undefined;
      }
    }
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  })
  @ValidateIf((o) => o.topIssues !== undefined && o.topIssues !== null)
  @IsArray()
  topIssues?: string[];

  @ApiPropertyOptional({ description: 'Issue positions', example: '{"education": "support"}' })
  @IsOptional()
  @IsObject()
  issuePositions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Previous candidate support', example: 'Candidate X' })
  @IsOptional()
  @IsString()
  previousCandidateSupport?: string;

  @ApiPropertyOptional({ description: 'Influencer score (0-100)', example: 80 })
  @IsOptional()
  @IsInt()
  @Min(0)
  influencerScore?: number;

  @ApiPropertyOptional({ description: 'Persuadability', example: 'ALTO' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  persuadability?: string;

  @ApiPropertyOptional({
    description: 'Turnout likelihood',
    enum: ['ALTO', 'MEDIO', 'BAIXO', 'NAO_DEFINIDO'],
    example: 'ALTO',
  })
  @IsOptional()
  @IsEnum(['ALTO', 'MEDIO', 'BAIXO', 'NAO_DEFINIDO'])
  turnoutLikelihood?: string;

  // Additional Information
  @ApiPropertyOptional({ description: 'Number of family members', example: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  familyMembers?: number;

  @ApiPropertyOptional({ description: 'Has WhatsApp?', example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'SIM') return true;
    if (value === 'NAO') return false;
    return value;
  })
  @IsBoolean()
  hasWhatsapp?: boolean;

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
    description: 'Tags for categorization',
    example: '["lideranca_local", "apoiador"]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    // Handle string-encoded arrays
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length === 0) return undefined;
        return parsed;
      } catch {
        return undefined;
      }
    }
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  })
  @ValidateIf((o) => o.tags !== undefined && o.tags !== null)
  @IsArray()
  tags?: string[];

  // Engagement & Behavioral
  @ApiPropertyOptional({ description: 'Engagement trend', example: 'CRESCENTE' })
  @IsOptional()
  @IsEnum(['CRESCENTE', 'ESTAVEL', 'DECRESCENTE', 'NAO_DEFINIDO'])
  engagementTrend?: string;

  @ApiPropertyOptional({ description: 'Seasonal activity (JSON)', example: '{"summer": 10}' })
  @IsOptional()
  @IsObject()
  seasonalActivity?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Last contact date', example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  lastContactDate?: string;

  @ApiPropertyOptional({ description: 'Contact frequency', example: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  contactFrequency?: number;

  @ApiPropertyOptional({ description: 'Response rate', example: 80 })
  @IsOptional()
  @IsInt()
  @Min(0)
  responseRate?: number;

  @ApiPropertyOptional({ description: 'Event attendance (JSON array)', example: '["event1"]' })
  @IsOptional()
  @IsArray()
  eventAttendance?: string[];

  @ApiPropertyOptional({
    description: 'Volunteer status',
    enum: ['ATIVO', 'INATIVO', 'INTERESSADO', 'NAO_VOLUNTARIO'],
    example: 'INTERESSADO',
  })
  @IsOptional()
  @IsEnum(['ATIVO', 'INATIVO', 'INTERESSADO', 'NAO_VOLUNTARIO'])
  volunteerStatus?: string;

  @ApiPropertyOptional({ description: 'Donation history (JSON array)', example: '[{"amount": 100}]' })
  @IsOptional()
  @IsArray()
  donationHistory?: Record<string, any>[];

  @ApiPropertyOptional({ description: 'Engagement score (0-100)', example: 80 })
  @IsOptional()
  @IsInt()
  @Min(0)
  engagementScore?: number;

  // Demographics Extended
  @ApiPropertyOptional({ description: 'Age group', example: '18-25' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ageGroup?: string;

  @ApiPropertyOptional({
    description: 'Household type',
    enum: [
      'SOLTEIRO',
      'FAMILIA_COM_FILHOS',
      'FAMILIA_SEM_FILHOS',
      'IDOSOS',
      'ESTUDANTES',
      'NAO_INFORMADO',
    ],
    example: 'SOLTEIRO',
  })
  @IsOptional()
  @IsEnum([
    'SOLTEIRO',
    'FAMILIA_COM_FILHOS',
    'FAMILIA_SEM_FILHOS',
    'IDOSOS',
    'ESTUDANTES',
    'NAO_INFORMADO',
  ])
  householdType?: string;

  @ApiPropertyOptional({
    description: 'Employment status',
    enum: [
      'EMPREGADO',
      'DESEMPREGADO',
      'APOSENTADO',
      'ESTUDANTE',
      'AUTONOMO',
      'NAO_INFORMADO',
    ],
    example: 'EMPREGADO',
  })
  @IsOptional()
  @IsEnum([
    'EMPREGADO',
    'DESEMPREGADO',
    'APOSENTADO',
    'ESTUDANTE',
    'AUTONOMO',
    'NAO_INFORMADO',
  ])
  employmentStatus?: string;

  @ApiPropertyOptional({ description: 'Vehicle ownership', example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'SIM') return true;
    if (value === 'NAO') return false;
    return value;
  })
  @IsBoolean()
  vehicleOwnership?: boolean;

  @ApiPropertyOptional({ description: 'Internet access', example: 'Fibra' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  internetAccess?: string;

  // Communication Preferences Extended
  @ApiPropertyOptional({
    description: 'Communication style',
    enum: ['FORMAL', 'INFORMAL', 'NAO_DEFINIDO'],
    example: 'FORMAL',
  })
  @IsOptional()
  @IsEnum(['FORMAL', 'INFORMAL', 'NAO_DEFINIDO'])
  communicationStyle?: string;

  @ApiPropertyOptional({ description: 'Content preference', example: '["Video"]' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    // Handle string-encoded arrays
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length === 0) return undefined;
        return parsed;
      } catch {
        return undefined;
      }
    }
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  })
  @ValidateIf((o) => o.contentPreference !== undefined && o.contentPreference !== null)
  @IsArray()
  contentPreference?: string[];

  @ApiPropertyOptional({ description: 'Best contact time', example: 'Manhã' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bestContactTime?: string;

  @ApiPropertyOptional({ description: 'Best contact day', example: '["Monday"]' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    // Handle string-encoded arrays
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length === 0) return undefined;
        return parsed;
      } catch {
        return undefined;
      }
    }
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  })
  @ValidateIf((o) => o.bestContactDay !== undefined && o.bestContactDay !== null)
  @IsArray()
  bestContactDay?: string[];

  // Social Network & Influence
  @ApiPropertyOptional({ description: 'Social media followers', example: 1000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  socialMediaFollowers?: number;

  @ApiPropertyOptional({
    description: 'Community role',
    enum: [
      'LIDER',
      'MEMBRO_ATIVO',
      'ATIVISTA',
      'MEMBRO',
      'NAO_PARTICIPANTE',
      'NAO_DEFINIDO',
    ],
    example: 'LIDER',
  })
  @IsOptional()
  @IsEnum([
    'LIDER',
    'MEMBRO_ATIVO',
    'ATIVISTA',
    'MEMBRO',
    'NAO_PARTICIPANTE',
    'NAO_DEFINIDO',
  ])
  communityRole?: string;

  @ApiPropertyOptional({ description: 'Network size', example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  networkSize?: number;

  @ApiPropertyOptional({ description: 'Influence radius', example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  influenceRadius?: number;

  @ApiPropertyOptional({ description: 'Referral code', example: 'JOAO-SILVA-123' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({ description: 'Referred by (Voter ID)', example: 'uuid' })
  @IsOptional()
  @IsString()
  referredBy?: string;

  @ApiPropertyOptional({ description: 'Referral date', example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  referralDate?: string;
}
