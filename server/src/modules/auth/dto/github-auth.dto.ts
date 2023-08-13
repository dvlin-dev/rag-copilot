import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginBase {
  @ApiProperty({ description: '设备Id' })
  @IsNotEmpty()
  device_id: string;

  @ApiProperty({ description: '设备类型' })
  @IsNotEmpty()
  device_type: string;
}
export class SignInByGithubAuthDto extends LoginBase {
  @ApiProperty({ description: 'code' })
  @IsNotEmpty()
  code: string;
}
