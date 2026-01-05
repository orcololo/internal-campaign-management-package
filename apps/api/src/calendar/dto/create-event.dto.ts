import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'Event title', example: 'Comício na Praça Central' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Event description', example: 'Grande comício com artistas locais' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Event type',
    enum: ['COMICIO', 'REUNIAO', 'VISITA', 'ENTREVISTA', 'DEBATE', 'CAMINHADA', 'CORPO_A_CORPO', 'EVENTO_PRIVADO', 'OUTRO'],
    example: 'COMICIO',
  })
  @IsEnum(['COMICIO', 'REUNIAO', 'VISITA', 'ENTREVISTA', 'DEBATE', 'CAMINHADA', 'CORPO_A_CORPO', 'EVENTO_PRIVADO', 'OUTRO'])
  type: string;

  @ApiPropertyOptional({
    description: 'Event status',
    enum: ['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'],
    example: 'AGENDADO',
    default: 'AGENDADO',
  })
  @IsOptional()
  @IsEnum(['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'])
  status?: string;

  @ApiProperty({
    description: 'Event visibility',
    enum: ['PUBLICO', 'PRIVADO', 'INTERNO'],
    example: 'PUBLICO',
    default: 'PUBLICO',
  })
  @IsEnum(['PUBLICO', 'PRIVADO', 'INTERNO'])
  visibility: string;

  @ApiProperty({ description: 'Start date', example: '2024-03-15' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Start time', example: '14:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Start time must be in HH:MM format' })
  startTime: string;

  @ApiProperty({ description: 'End date', example: '2024-03-15' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'End time', example: '18:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'End time must be in HH:MM format' })
  endTime: string;

  @ApiPropertyOptional({ description: 'All day event', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiPropertyOptional({ description: 'Event location name', example: 'Praça Central' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ description: 'Full address', example: 'Rua das Flores, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'São Paulo' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State', example: 'SP' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code', example: '01234-567' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Latitude', example: '-23.5505' })
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiPropertyOptional({ description: 'Longitude', example: '-46.6333' })
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiPropertyOptional({ description: 'Expected attendees', example: '200-500' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  expectedAttendees?: string;

  @ApiPropertyOptional({ description: 'Confirmed attendees', example: '150' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  confirmedAttendees?: string;

  @ApiPropertyOptional({ description: 'Event organizer', example: 'Comitê Central' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  organizer?: string;

  @ApiPropertyOptional({ description: 'Contact person', example: 'Maria Silva' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Contact email', example: 'maria@example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Tags (JSON array)', example: '["importante", "eleicao2024"]' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Color for calendar display', example: '#FF5733' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Color must be a valid hex color code' })
  color?: string;

  @ApiPropertyOptional({ description: 'Set reminder', example: true, default: false })
  @IsOptional()
  @IsBoolean()
  reminderSet?: boolean;

  @ApiPropertyOptional({ description: 'Reminder minutes before event', example: '30' })
  @IsOptional()
  @IsString()
  reminderMinutesBefore?: string;
}
