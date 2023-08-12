import { createHash } from 'crypto';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export function ensureArray(input: string | string[]): string[] {
  return Array.isArray(input) ? input : [input];
}

export function generateHash(input) {
  const hash = createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

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
  const config = { ...defaultConfig, ...envConfig };
  return config;
}
