import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({ description: '消息 id', required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '打分', required: true })
  @IsNumber()
  ratingValue: number;
}
