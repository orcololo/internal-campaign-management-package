import { IsNumber, Min, Max, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LatLng {
  @ApiProperty({ description: 'Latitude', example: -23.5505 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ description: 'Longitude', example: -46.6333 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class CheckPolygonDto {
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
    description: 'Polygon coordinates (array of lat/lng points)',
    type: [LatLng],
    example: [
      { lat: -23.55, lng: -46.63 },
      { lat: -23.56, lng: -46.63 },
      { lat: -23.56, lng: -46.64 },
      { lat: -23.55, lng: -46.64 },
    ],
  })
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => LatLng)
  polygon: LatLng[];
}
