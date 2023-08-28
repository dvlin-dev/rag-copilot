import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty({ description: '内容', required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '内容', required: true })
  @IsNumber()
  @IsNotEmpty()
  size: number;
}
