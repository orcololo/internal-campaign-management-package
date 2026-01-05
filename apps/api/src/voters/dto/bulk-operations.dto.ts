import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVoterDto } from './update-voter.dto';

export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of voter IDs to delete',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  ids: string[];
}

export class BulkUpdateItemDto {
  @ApiProperty({
    description: 'Voter ID',
    example: 'uuid-1',
  })
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @ApiProperty({
    description: 'Voter data to update',
    type: () => UpdateVoterDto,
  })
  @ValidateNested()
  @Type(() => UpdateVoterDto)
  data: UpdateVoterDto;
}

export class BulkUpdateDto {
  @ApiProperty({
    description: 'Array of voter updates',
    type: [BulkUpdateItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateItemDto)
  updates: BulkUpdateItemDto[];
}
