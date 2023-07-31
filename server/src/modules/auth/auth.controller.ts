import {
  Body,
  Controller,
  Post,
  UseFilters,
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
import { TypeormFilter } from 'src/filters/typeorm.filter';
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
@UseFilters(new TypeormFilter())
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
  @Post('/refresh_token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return await this.authService.generateAccessTokenFromRefreshToken(
      refreshToken
    );
  }

  // 退出登录
  @ApiOperation({ summary: '退出登录' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post('/logout')
  async logout(@Req() req, @Body('deviceId') deviceId: string) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const { userId } = req.user;
    return await this.redis.del(`${userId}_${deviceId}_token`);
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
    await this.emailService.sendVerificationCode(email);
  }

  @ApiOperation({ summary: '获取当前登录设备' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('get_user_devices')
  async getUserDevices(@Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const { userId } = req.user as JwtPayload;
    return await this.authService.findUserDevices(userId);
  }

  @ApiOperation({ summary: '强制退出某设备' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'deviceId', description: '需要强制退出的设备 ID' })
  @Delete('delete_user_device/:deviceId')
  async forceLogoutDevice(@Req() req, @Param('deviceId') deviceId: string) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const { userId } = req.user as JwtPayload;

    return await this.authService.forceLogoutDevice(userId, deviceId);
  }

  @ApiOperation({ summary: 'github 授权' })
  @Post('github')
  async githubaAuth(@Body() dto: SignInByGithubAuthDto, @Req() req) {
    return await this.authService.githubAUth(dto, req);
  }
}
