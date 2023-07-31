import {
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as requestIp from 'request-ip';
import { ConfigEnum } from 'src/enum/config.enum';
import { ComponentStatus } from 'src/modules/status/enum';
import { StatusService } from 'src/modules/status/status.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private lastStatusUpdateTime: Date;
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly statusService: StatusService,
    private readonly configService: ConfigService
  ) {
    this.lastStatusUpdateTime = new Date(0);
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(exception.message, exception.stack);
    const msg: unknown = exception['response'] || '网络错误';
    const responseBody = {
      timestamp: new Date().toISOString(),
      body: request.body,
      params: request.params,
      status: httpStatus,
      exceptioin: exception['name'],
      message: msg,
    };

    const isProd = process.env.NODE_ENV === 'production';
    const httpError =
      exception instanceof HttpException && exception.getStatus() >= 500;
    if (isProd && httpError) {
      // statuspage
      const now = new Date();
      const timeDiffInHours =
        (now.getTime() - this.lastStatusUpdateTime.getTime()) / 1000 / 3600;

      if (timeDiffInHours >= 24) {
        const componentId = this.configService.get(ConfigEnum.COMPONENT_ID);
        const pageId = this.configService.get(ConfigEnum.PAGE_ID);
        const statusApiKey = this.configService.get(
          ConfigEnum.STATUSPAGE_API_KEY
        );

        const status = ComponentStatus.PartialOutage;

        this.statusService.updateComponentStatus(
          componentId,
          status,
          pageId,
          statusApiKey
        );
        this.lastStatusUpdateTime = now;
      }
    }

    this.logger.error('[devLink]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
