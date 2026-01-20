import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckGeofenceDto {
  @ApiProperty({
    description: 'Latitude of point to check',
    example: -23.5505,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  pointLat: number;

  @ApiProperty({
    description: 'Longitude of point to check',
    example: -46.6333,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  pointLng: number;

  @ApiProperty({
    description: 'Latitude of geofence center',
    example: -23.55,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  centerLat: number;

  @ApiProperty({
    description: 'Longitude of geofence center',
    example: -46.63,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  centerLng: number;

  @ApiProperty({
    description: 'Geofence radius in kilometers',
    example: 1.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  radiusKm: number;
}
