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

import { CreateGeofenceRequest } from '@repo/types';

export class CreateGeofenceDto implements CreateGeofenceRequest {
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
    enum: ['circle', 'polygon'],
    example: 'circle',
  })
  @IsEnum(['circle', 'polygon'])
  type: 'circle' | 'polygon';

  // Coordinates
  @ApiProperty({
    description: 'Coordinates (Point for CIRCLE, Polygon rings for POLYGON)',
    example: [-23.5505, -46.6333],
  })
  @IsNotEmpty()
  coordinates: number[][][] | [number, number];

  @ApiPropertyOptional({ description: 'Radius in meters (for CIRCLE)', example: 2500 })
  @ValidateIf((o) => o.type === 'circle')
  @IsNumber()
  radius?: number;

  // Legacy fields removed or mapped


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

  @ApiPropertyOptional({
    description: 'Tags (JSON array)',
    example: '["prioridade", "zona_eleitoral_1"]',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Notes', example: 'Área com alta concentração de eleitores' })
  @IsOptional()
  @IsString()
  notes?: string;
}
