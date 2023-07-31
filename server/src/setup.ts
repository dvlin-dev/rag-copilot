import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getServerConfig } from '../ormconfig';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { StatusService } from './modules/status/status.service';
import { UserService } from './modules/user/user.service';
import { ConfigService } from '@nestjs/config';

export const setupApp = (app: INestApplication) => {
  const config = getServerConfig();

  const flag: boolean = config['LOG_ON'] === 'true';
  flag && app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const httpAdapter = app.get(HttpAdapterHost);
  // // 全局Filter只能有一个
  const logger = new Logger();
  app.useGlobalFilters(
    new AllExceptionFilter(
      logger,
      httpAdapter,
      app.get(StatusService),
      app.get(ConfigService)
    )
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
    })
  );

  // helmet头部安全
  app.use(helmet());

  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    })
  );

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.enableCors({
      origin: (origin, callback) => {
        console.info('origin', origin);
        const allowedOrigins = [
          'https://devlink.wiki',
          'https://devlink.wiki',
          `https://${config['DB_HOST']}`,
          `http://${config['DB_HOST']}`,
        ]; // 您可以在此列表中添加更多允许的域名
        // 如果 origin 未定义（例如，通过 Postman 进行 API 调用），允许请求
        if (!origin) return callback(null, true);

        // 检查 origin 是否在允许的域名列表中
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = `CORS policy: ${origin} is not allowed.`;
          return callback(new Error(msg), false);
        }

        return callback(null, true);
      },
    });
    const adminAccountService = app.get(UserService);
    adminAccountService.createAdminAccount();
  } else {
    app.enableCors();
  }
};
