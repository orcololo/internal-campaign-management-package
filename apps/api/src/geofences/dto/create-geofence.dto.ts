import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  ValidateIf,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class PolygonPoint {
  @ApiProperty({ description: 'Latitude', example: -23.5505 })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude', example: -46.6333 })
  @IsNumber()
  lng: number;
}

export class CreateGeofenceDto {
  @ApiProperty({ description: 'Geofence name', example: 'Zona Central' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Description', example: 'Região central da cidade' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Geofence type',
    enum: ['CIRCLE', 'POLYGON'],
    example: 'CIRCLE',
  })
  @IsEnum(['CIRCLE', 'POLYGON'])
  type: string;

  // Circle properties
  @ApiPropertyOptional({ description: 'Center latitude (for CIRCLE)', example: -23.5505 })
  @ValidateIf((o) => o.type === 'CIRCLE')
  @IsNumber()
  centerLatitude?: number;

  @ApiPropertyOptional({ description: 'Center longitude (for CIRCLE)', example: -46.6333 })
  @ValidateIf((o) => o.type === 'CIRCLE')
  @IsNumber()
  centerLongitude?: number;

  @ApiPropertyOptional({ description: 'Radius in kilometers (for CIRCLE)', example: 2.5 })
  @ValidateIf((o) => o.type === 'CIRCLE')
  @IsNumber()
  radiusKm?: number;

  // Polygon properties
  @ApiPropertyOptional({
    description: 'Polygon points (for POLYGON)',
    type: [PolygonPoint],
    example: [
      { lat: -23.5505, lng: -46.6333 },
      { lat: -23.5515, lng: -46.6343 },
      { lat: -23.5525, lng: -46.6323 },
    ],
  })
  @ValidateIf((o) => o.type === 'POLYGON')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolygonPoint)
  polygon?: PolygonPoint[];

  // Location info
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

  @ApiPropertyOptional({ description: 'Neighborhood', example: 'Centro' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;

  @ApiPropertyOptional({ description: 'Color (hex)', example: '#3B82F6' })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiPropertyOptional({ description: 'Tags (JSON array)', example: '["prioridade", "zona_eleitoral_1"]' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Notes', example: 'Área com alta concentração de eleitores' })
  @IsOptional()
  @IsString()
  notes?: string;
}
