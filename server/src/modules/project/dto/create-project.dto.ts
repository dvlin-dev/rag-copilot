import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: '名字', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '描述', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'prompt', required: false })
  @IsString()
  @IsOptional()
  prompt: string;

  @ApiProperty({ description: 'questions', required: false })
  @IsArray()
  @IsOptional()
  questions: string[];

  @ApiProperty({ description: 'white_list', required: false })
  @IsArray()
  @IsOptional()
  white_list: string[];

  @ApiProperty({ description: 'ip_limit', required: true })
  @IsNumber()
  @IsOptional()
  ip_limit: string;
}
