import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInByGithubAuthDto {
  @ApiProperty({ description: 'code' })
  @IsNotEmpty()
  code: string;
}
