import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  // UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Logs } from '../../entity/logs.entity';
import { Action } from 'src/enum/action.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Controller('logs')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiOperation({ summary: '查询用户日志' })
  @Get(':id')
  getUserLogs(@Param('id') id: string) {
    return this.logsService.findById(id);
  }

  // // 添加日志
  // @Post()
  // addLogs(@Body() body: CreateLogsDto) {
  //   return this.logsService.create(body);
  // }
}
