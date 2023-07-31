import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
// import { getUserDto } from '../user/dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Profile } from 'src/entity/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountType, User } from '../../entity/user.entity';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { SignupUserDto } from './dto/signup-user.dto';
import { KickedOutTips } from 'src/constant';
import { Device } from 'src/entity/device.entity';
import {
  SignInByEmailAndCodeDto,
  SignInByEmailAndPassowrdDto,
} from './dto/signin-user.dto';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { SignInByGithubAuthDto } from './dto/github-auth.dto';
import { generateHash } from 'src/utils';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  deviceId: string;
}

const jwtExpirationInSeconds = 24 * 60 * 60;
const jwtRefreshExpirationInSeconds = 180 * 24 * 60 * 60;

@Injectable()
export class AuthService {
  private proxyUrl: string;

  constructor(
    private userService: UserService,
    private jwt: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService
  ) {
    this.proxyUrl = this.configService.get('PROXY_URL');
  }

  async signInByEmailAndPassword(
    dto: SignInByEmailAndPassowrdDto,
    req: Request
  ) {
    const clientIp = this.getClientIp(req);
    const { email, password, deviceId, deviceType } = dto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }
    const { accessToken, refreshToken } = await this.jwtToken(user, deviceId);

    await this.updateOrCreateDevice(
      deviceId,
      deviceType,
      user,
      refreshToken,
      clientIp
    );

    await this.userRepository.save(user);

    await this.storeAccessTokenInRedis(user.id, deviceId, accessToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async updateOrCreateDevice(
    deviceId: string,
    deviceType: string,
    user: User,
    refreshToken: string,
    clientIp: string
  ) {
    const device = await this.deviceRepository.findOne({
      where: { deviceId, user: { id: user.id } },
    });
    if (!device) {
      // 设备不存在，创建新设备记录
      const newDevice = this.deviceRepository.create({
        deviceId,
        deviceType,
        clientIp,
        user,
        lastLoginAt: new Date(), // 设置最后登录时间为当前时间
        refreshToken,
        refreshTokenExpiresAt: Number(
          new Date(Date.now() + jwtRefreshExpirationInSeconds * 1000)
        ),
      });
      await this.deviceRepository.save(newDevice);
    } else {
      // 设备已存在，更新最后登录时间
      device.lastLoginAt = new Date(); // 更新设备的最后登录时间为当前时间
      device.refreshToken = refreshToken;
      device.clientIp = clientIp;
      device.refreshTokenExpiresAt = Number(
        new Date(Date.now() + jwtRefreshExpirationInSeconds * 1000)
      );
      await this.deviceRepository.save(device);
    }
  }

  private getClientIp(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (Array.isArray(xForwardedFor)) {
      return xForwardedFor[0] || 'unknown';
    } else if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim() || 'unknown';
    } else if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress;
    } else if (req.socket && req.socket.remoteAddress) {
      return req.socket.remoteAddress;
    } else {
      return 'unknown';
    }
  }

  async storeAccessTokenInRedis(
    userId: string,
    deviceId: string,
    accessToken: string
  ) {
    await this.redis.set(
      `${userId}_${deviceId}_token`,
      accessToken,
      'EX',
      jwtExpirationInSeconds
    );
  }

  async deleteAccessTokenInRedis(userId: string, deviceId: string) {
    await this.redis.set(
      `${userId}_${deviceId}_token`,
      KickedOutTips,
      'EX',
      jwtExpirationInSeconds
    );
  }

  async signInByEmailAndCode(dto: SignInByEmailAndCodeDto, req: Request) {
    const { email, code, deviceId, deviceType } = dto;
    const clientIp = this.getClientIp(req);
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

    const { accessToken, refreshToken } = await this.jwtToken(user, deviceId);

    await this.userRepository.save(user);

    await this.updateOrCreateDevice(
      deviceId,
      deviceType,
      user,
      refreshToken,
      clientIp
    );

    await this.storeAccessTokenInRedis(user.id, deviceId, accessToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async jwtToken(user: User, deviceId: string) {
    const accessToken = await this.jwt.signAsync(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        deviceId,
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

  async generateAccessTokenFromRefreshToken(refreshToken: string) {
    let decodedRefreshToken: JwtPayload;

    try {
      // 验证 refreshToken 是否有效
      decodedRefreshToken = this.jwt.verify(refreshToken);
    } catch (error) {
      // 如果无效，则抛出异常
      throw new UnauthorizedException('无效的 refreshToken');
    }

    // 从解码的 refreshToken 中获取用户 ID
    const { userId, deviceId } = decodedRefreshToken;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const device = await this.deviceRepository.findOne({
      where: { id: deviceId, user: { id: user.id } },
    });

    // 验证 refreshToken 是否存在和未过期
    if (
      !device ||
      device.refreshToken !== refreshToken ||
      device.refreshTokenExpiresAt < Date.now()
    ) {
      throw new UnauthorizedException('无效或过期的 refreshToken');
    }

    const { accessToken } = await this.jwtToken(user, deviceId);

    // 返回新的 accessToken
    return {
      accessToken,
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

  async findUserDevices(userId: string) {
    const devices = await this.deviceRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'deviceId', 'deviceType', 'lastLoginAt', 'clientIp'],
      order: {
        lastLoginAt: 'DESC',
      },
    });
    return {
      devices,
    };
  }

  async forceLogoutDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId, user: { id: userId } },
      relations: ['user'],
    });
    if (device) {
      await this.deviceRepository.remove(device);
    } else {
      throw new NotFoundException('设备不存在');
    }
    await this.deleteAccessTokenInRedis(device.user.email, device.deviceId);
  }

  async githubAUth(dto: SignInByGithubAuthDto, req: Request) {
    const { code, deviceId, deviceType } = dto;
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const secret = this.configService.get('GITHUB_SECRET');
    const clientIp = this.getClientIp(req);

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
        user = await this.userService.create({
          username,
          githubId: id,
          accountType: AccountType.GITHUB,
          profile: {
            githubLogin: login,
            githubName: name,
          },
        });
        await this.userRepository.save(user);
      }
      // 生成 accessToken 和 refreshToken
      const { accessToken: newAccessToken, refreshToken } = await this.jwtToken(
        user,
        deviceId
      );

      await this.updateOrCreateDevice(
        deviceId,
        deviceType,
        user,
        refreshToken,
        clientIp
      );

      await this.storeAccessTokenInRedis(user.id, deviceId, newAccessToken);

      // 将 refreshToken 存入数据完户登录
      await this.updateOrCreateDevice(
        deviceId,
        deviceType,
        user,
        refreshToken,
        clientIp
      );
      // 返回 accessToken 和 refreshToken
      return {
        user,
        accessToken: newAccessToken,
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
