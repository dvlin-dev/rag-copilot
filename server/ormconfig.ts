import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigEnum } from './src/enum/config.enum';

// 通过环境变量读取不同的.env文件
export function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

export function getServerConfig() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(
    `.env.${process.env.NODE_ENV || 'development' || 'production'}`
  );
  // configService
  const config = { ...defaultConfig, ...envConfig };
  return config;
}

// 通过dotENV来解析不同的配置
export function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  // configService
  const config = { ...defaultConfig, ...envConfig };
  const logFlag = config['LOG_ON'] === 'true';
  const entitiesDir = [
    path.join(__dirname, 'src', 'entity', '*.entity{.js,.ts}'),
  ];

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: entitiesDir,
    // 同步本地的schema与数据库 -> 初始化的时候去使用
    synchronize: true,
    logging: logFlag && process.env.NODE_ENV === 'development',
    // logging: false,
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
