import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocsDto {
  @ApiProperty({ description: 'id', required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '名字', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '描述', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;
}
