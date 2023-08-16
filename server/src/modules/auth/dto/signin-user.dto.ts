import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginBase {
  @ApiProperty({ description: '设备Id' })
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ description: '设备类型' })
  @IsNotEmpty()
  deviceType: string;
}
export class SignInByEmailAndPassowrdDto extends LoginBase {
  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  @ApiProperty()
  password: string;
}

export class SignInByEmailAndCodeDto extends LoginBase {
  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '验证码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  @ApiProperty()
  code: string;
}
