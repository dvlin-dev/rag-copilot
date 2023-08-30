import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @ApiProperty({ description: 'context', required: true })
  @IsString()
  @IsNotEmpty()
  content: string;
}
