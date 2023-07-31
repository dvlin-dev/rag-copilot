import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Gender } from '../../../entity/profile.entity';

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

  @ApiProperty({ description: '性别', enum: Gender }) // 指定枚举类型
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

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
