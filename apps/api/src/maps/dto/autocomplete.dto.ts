import { IsString, IsNotEmpty, MinLength, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AutocompleteDto {
  @ApiProperty({
    description: 'Partial address input',
    example: 'Av Paulista',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  input: string;

  @ApiPropertyOptional({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'BR',
    default: 'BR',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;
}
