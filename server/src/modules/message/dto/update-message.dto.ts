import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({ description: '打分', required: true })
  @IsNumber()
  ratingValue: number;
}
