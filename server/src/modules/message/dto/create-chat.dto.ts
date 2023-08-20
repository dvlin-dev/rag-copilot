import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ description: '项目 id', required: true })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: '内容', required: true })
  @IsString()
  @IsNotEmpty()
  content: string;
}
