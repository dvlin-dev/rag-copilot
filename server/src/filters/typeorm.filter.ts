import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  LoggerService,
} from '@nestjs/common';
import { TypeORMError, QueryFailedError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }
    // 响应 请求对象
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const msg: unknown = exception['response'] || '网络错误';

    console.info('TypeormError', exception);

    response.status(500).json({
      timestamp: new Date().toISOString(),
      message: msg,
      exceptioin: exception['name'],
      body: request.body,
      status: code,
      params: request.params,
    });
  }
}
