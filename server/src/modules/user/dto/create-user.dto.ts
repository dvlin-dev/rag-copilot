import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Roles } from 'src/entity/roles.entity';

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

  roles?: Roles[] | number[];
}
