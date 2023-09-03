import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'projectId', required: true })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'projectId', required: false })
  @IsString()
  @IsOptional()
  namespace: string;
}
