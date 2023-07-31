import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { JwtPayload } from 'src/modules/auth/auth.service';
import { TokenExpiredMessage } from 'src/constant';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // custom logic can go here
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!token) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    let payload;
    try {
      payload = await verify(token, this.configService.get(ConfigEnum.SECRET));
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(TokenExpiredMessage);
      }
      throw error;
    }
    const { userId, deviceId } = payload as JwtPayload;
    const tokenCache = userId
      ? await this.redis.get(`${userId}_${deviceId}_token`)
      : null;

    if (!payload || !userId || tokenCache !== token) {
      throw new UnauthorizedException(TokenExpiredMessage);
    } else if (tokenCache === 'kickedout') {
      throw new UnauthorizedException('您的设备被强制下线，请重新登录');
    }
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}
