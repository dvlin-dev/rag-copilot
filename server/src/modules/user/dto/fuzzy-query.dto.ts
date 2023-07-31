import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FuzzyQueryDto {
  @ApiProperty({ description: '页数', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页的数量', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: '关键词', required: true })
  @IsString()
  keyword: string;
}
