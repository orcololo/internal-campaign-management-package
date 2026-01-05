import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class ImportVotersDto {
  @ApiProperty({
    description: 'CSV file to import',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Skip duplicate entries (by CPF)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  skipDuplicates?: boolean = true;

  @ApiProperty({
    description: 'Auto-geocode addresses during import',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoGeocode?: boolean = false;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: Array<{
    row: number;
    data: Record<string, unknown>;
    error: string;
  }>;
}
