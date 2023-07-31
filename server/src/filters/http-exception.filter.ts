import { LoggerService } from '@nestjs/common';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // http状态码
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);
    const msg: unknown = exception['response'] || '网络错误';

    response.status(status).json({
      timestamp: new Date().toISOString(),
      status,
      message: msg,
      exceptioin: exception['name'],
      body: request.body,
      params: request.params,
    });
  }
}
