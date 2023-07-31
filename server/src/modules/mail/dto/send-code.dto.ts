import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({ description: '邮箱' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
