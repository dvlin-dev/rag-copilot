import { ApiProperty } from '@nestjs/swagger';
import { ProfileGenderEnum } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDocsDto {
  @ApiProperty({ description: '名字', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '描述', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;
}
