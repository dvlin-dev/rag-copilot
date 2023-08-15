import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ProfileGenderEnum } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @Length(6, 20)
  @IsString()
  username?: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '性别', enum: ProfileGenderEnum })
  @IsOptional()
  gender?: ProfileGenderEnum;

  @ApiProperty({ description: '照片' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '个人描述' })
  @IsOptional()
  @Length(0, 200)
  @IsString()
  description?: string;
}
