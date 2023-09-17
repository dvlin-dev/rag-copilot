import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { SignupUserDto } from './dto/signup-user.dto';
import { KickedOutTips } from 'src/constant';
import {
  SignInByEmailAndCodeDto,
  SignInByEmailAndPassowrdDto,
} from './dto/signin-user.dto';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { SignInByGithubAuthDto } from './dto/github-auth.dto';
import { generateHash } from 'src/utils';
import { Prisma, UserProfile, User, UserAccountTypeEnum } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

const jwtExpirationInSeconds = 24 * 60 * 60;
const jwtRefreshExpirationInSeconds = 180 * 24 * 60 * 60;

@Injectable()
export class AuthService {
  private proxyUrl: string;

  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService
  ) {
    this.proxyUrl = this.configService.get('PROXY_URL');
  }

  async signInByEmailAndPassword(
    dto: SignInByEmailAndPassowrdDto,
    req: Request
  ) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }
    const { accessToken, refreshToken } = await this.jwtToken(user);

    await this.storeAccessTokenInRedis(user.id, accessToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async storeAccessTokenInRedis(userId: string, accessToken: string) {
    await this.redis.set(
      `${userId}_token`,
      accessToken,
      'EX',
      jwtExpirationInSeconds
    );
  }

  async deleteAccessTokenInRedis(userId: string) {
    await this.redis.set(
      `${userId}_token`,
      KickedOutTips,
      'EX',
      jwtExpirationInSeconds
    );
  }

  async signInByEmailAndCode(dto: SignInByEmailAndCodeDto, req: Request) {
    const { email, code } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    const getCode = await this.redis.get(`${email}_code`);
    if (!code || code !== getCode) {
      throw new ForbiddenException('验证码已过期');
    } else {
      this.redis.del(`${email}_code`);
    }

    const { accessToken, refreshToken } = await this.jwtToken(user);

    await this.storeAccessTokenInRedis(user.id, accessToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async jwtToken(user: User) {
    const accessToken = await this.jwt.signAsync(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      {
        expiresIn: '1d',
      }
    );

    const refreshToken = this.jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      { expiresIn: '180 days' }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessTokenFromRefreshToken(_refreshToken: string) {
    let decodedRefreshToken: JwtPayload;

    try {
      // 验证 refreshToken 是否有效
      decodedRefreshToken = this.jwt.verify(_refreshToken);
    } catch (error) {
      // 如果无效，则抛出异常
      throw new UnauthorizedException('无效的 refreshToken');
    }

    // 从解码的 refreshToken 中获取用户 ID
    const { userId } = decodedRefreshToken;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const { accessToken, refreshToken } = await this.jwtToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(user: SignupUserDto) {
    const { username, email, password } = user;
    const usertmp = await this.userService.findByEmail(email);

    if (usertmp) {
      throw new ForbiddenException('用户已存在');
    }

    const code = await this.redis.get(`${email}_code`);
    if (!code) {
      throw new ForbiddenException('验证码已过期');
    }

    const res = await this.userService.create({
      username,
      email,
      password,
    });
    this.redis.del(`${email}_code`);
    return res;
  }

  async githubAUth(dto: SignInByGithubAuthDto, req: Request) {
    const { code } = dto;
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const secret = this.configService.get('GITHUB_SECRET');

    try {
      const accessToken = await this.getGithubToken(code, clientId, secret);
      const userInfo = await this.getGithubUser(accessToken);
      const { login, id, name } = userInfo;
      // 去用户系统中查询该用户
      let user = await this.userService.findByGithubId(id);
      if (!user) {
        // 用户不存圮，则创廻用户
        const findUserByGithubName = this.userService.find(login);
        const hash = generateHash(login).substring(0, 5);
        const username = !!(await findUserByGithubName)?.id
          ? login + hash
          : login;
        user = (await this.userService.create({
          username,
          githubId: id,
          accountType: UserAccountTypeEnum.github,
          profile: {
            githubLogin: login,
            githubName: name,
          } as UserProfile,
        })) as any;
      }
      // 生成 accessToken 和 refreshToken
      const { accessToken: newAccessToken, refreshToken } = await this.jwtToken(
        user
      );

      await this.storeAccessTokenInRedis(user.id, newAccessToken);

      return {
        user,
        accessToken: newAccessToken,
        refreshToken,
      };
    } catch (error) {
      console.info('github auth error', error);
      throw new Error('github 授权失败');
    }
  }

  async getGithubToken(code: string, clientId: string, clientSecret: string) {
    const response = await fetch(
      `${this.proxyUrl}/github.com/login/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to get access token from GitHub');
    }

    const data = await response.json();

    return data.access_token;
  }

  async getGithubUser(accessToken: string) {
    const response = await fetch(`${this.proxyUrl}/api.github.com/user`, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info from GitHub');
    }

    return await response.json();
  }
}
