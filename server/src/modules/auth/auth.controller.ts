import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
  UseGuards,
  Delete,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import type { Request } from 'express';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { AuthService, JwtPayload } from './auth.service';
import {
  SignInByEmailAndPassowrdDto,
  SignInByEmailAndCodeDto,
} from './dto/signin-user.dto';
import { EmailService } from '../mail/mail.service';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user.dto';
import { SendCodeDto } from 'src/modules/mail/dto/send-code.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TokenExpiredMessage } from 'src/constant';
import { SignInByGithubAuthDto } from './dto/github-auth.dto';

@ApiTags('用户验证')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly emailService: EmailService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  @ApiOperation({ summary: '邮箱&密码 登录' })
  @Post('/signin_by_password')
  async signInByEmailAndPassword(
    @Body() dto: SignInByEmailAndPassowrdDto,
    @Req() req: Request
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signInByEmailAndPassword(dto, req);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({ summary: '邮箱&验证码 登录' })
  @Post('/signin_by_code')
  async signInByEmailAndcode(
    @Body() dto: SignInByEmailAndCodeDto,
    @Req() req: Request
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signInByEmailAndCode(dto, req);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({ summary: '根据 refreshToken 生成新的 accessToken' })
  @Post('/refreshToken')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.generateAccessTokenFromRefreshToken(refreshToken);
  }

  // 退出登录
  @ApiOperation({ summary: '退出登录' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post('/logout')
  async logout(@Req() req) {
    const { userId } = req.user;
    return this.redis.del(`${userId}_token`);
  }

  @ApiOperation({ summary: '注册' })
  @Post('signup')
  signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: '发送验证码' })
  @ApiBody({ description: '邮箱', type: SendCodeDto })
  @ApiOkResponse({ description: '验证码', type: String })
  @Post('send-code')
  async sendVerificationCode(@Body('email') email: string): Promise<void> {
    return this.emailService.sendVerificationCode(email);
  }

  @ApiOperation({ summary: 'github 授权' })
  @Post('github')
  githubaAuth(@Body() dto: SignInByGithubAuthDto, @Req() req) {
    return this.authService.githubAUth(dto, req);
  }
}
