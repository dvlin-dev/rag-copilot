import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchVectorDto {
  @ApiProperty({ description: '内容', required: true })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: '知识库 id', required: true })
  @IsString()
  @IsNotEmpty()
  docsId: string;

  @ApiProperty({ description: '数量', required: true })
  @IsNotEmpty()
  size: number;
}
