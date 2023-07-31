import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: '邮箱', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;
}
