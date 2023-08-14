import { ApiProperty } from '@nestjs/swagger';
import { ProfileGenderEnum } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateVectorDto {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '内容', required: false })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '来源', required: false })
  @IsString()
  @IsOptional()
  source: string;

  @ApiProperty({ description: '命名空间', required: false })
  @IsString()
  @IsOptional()
  namespace: string;

  @ApiProperty({ description: '元数据', required: false })
  @IsString()
  @IsOptional()
  metadata: string;
}
