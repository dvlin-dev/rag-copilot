import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '名字', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: '描述', required: false })
  @IsString()
  @IsOptional()
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

  @ApiProperty({ description: 'ip_limit', required: false })
  @IsNumber()
  @IsOptional()
  ip_limit: string;
}
