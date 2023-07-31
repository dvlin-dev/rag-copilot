import { Module } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import { utilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogEnum } from 'src/enum/config.enum';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from 'src/entity/logs.entity';

function createDailyRotateTrasnport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    ),
  });
}
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const timestamp = configService.get(LogEnum.TIMESTAMP) === 'true';
        const conbine = [];
        if (timestamp) {
          conbine.push(winston.format.timestamp());
        }
        conbine.push(utilities.format.nestLike());
        const consoleTransports = new Console({
          level: configService.get(LogEnum.LOG_LEVEL) || 'info',
          format: winston.format.combine(...conbine),
        });

        return {
          transports: [
            consoleTransports,
            ...(configService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateTrasnport('info', 'application'),
                  createDailyRotateTrasnport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([Logs]),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
