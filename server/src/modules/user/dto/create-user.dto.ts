import { ApiProperty } from '@nestjs/swagger';
import { UsersRole } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @ApiProperty({ description: '电子邮箱' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;

  roles?: UsersRole[] | number[];
}
