import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateDistanceDto {
  @ApiProperty({
    description: 'Latitude of first point',
    example: -23.5505,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat1: number;

  @ApiProperty({
    description: 'Longitude of first point',
    example: -46.6333,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng1: number;

  @ApiProperty({
    description: 'Latitude of second point',
    example: -23.5629,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat2: number;

  @ApiProperty({
    description: 'Longitude of second point',
    example: -46.6544,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng2: number;
}
