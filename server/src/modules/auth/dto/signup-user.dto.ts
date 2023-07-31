import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignupUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // $value: 当前用户传入的值
    // $property: 当前属性名
    // $target: 当前类
    // $constraint1: 最小长度 ...
    message: `用户名长度必须在$constraint1到$constraint2之间，当前传递的值是：$value`,
  })
  username: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '验证码' })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  code: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;
}
