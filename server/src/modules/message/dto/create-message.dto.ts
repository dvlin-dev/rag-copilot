import { ApiProperty } from '@nestjs/swagger';
import { MessageRole } from '@prisma/client';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: '会话id', required: true })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ description: '内容', required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '角色', required: true })
  @IsString()
  role: MessageRole;
}
