import { ApiProperty } from '@nestjs/swagger';
import { MessageRole } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

class MessageDto {
  @ApiProperty({ description: 'message content', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'role', required: true })
  @IsString()
  role: MessageRole;
}

export class ChatDto {
  @ApiProperty({ description: 'messages', required: true, type: [MessageDto] })
  @IsNotEmpty()
  messages: MessageDto[];
}
