import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeocodeDto {
  @ApiProperty({
    description: 'Address to geocode',
    example: 'Av. Paulista, 1000, São Paulo, SP, Brazil',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  address: string;
}
