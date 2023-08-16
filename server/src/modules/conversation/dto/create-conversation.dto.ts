import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'projectId', required: true })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
