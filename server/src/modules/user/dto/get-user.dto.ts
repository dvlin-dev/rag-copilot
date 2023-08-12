import { ApiProperty } from '@nestjs/swagger';
import { ProfileGenderEnum } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class getUserDto {
  @ApiProperty({ description: '页数', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页的数量', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: '角色',
    enum: ProfileGenderEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: number;

  @ApiProperty({
    description: '性别',
    enum: ProfileGenderEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProfileGenderEnum)
  gender?: ProfileGenderEnum;
}
