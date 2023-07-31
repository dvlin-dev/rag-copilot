import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from 'src/entity/roles.entity';
import { Gender } from '../../../entity/profile.entity';

export class getUserDto {
  @ApiProperty({ description: '页数', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页的数量', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: '角色', enum: RolesEnum, required: false })
  @IsOptional()
  @IsString()
  role?: number;

  @ApiProperty({ description: '性别', enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
