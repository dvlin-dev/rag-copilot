import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { getServerConfig } from '../ormconfig';
import { generateDocument } from './doc';
import { httpsOptions } from './https-options';

async function bootstrap() {
  const config = getServerConfig();
  const isProd = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: isProd ? httpsOptions : null,
  });
  app.setGlobalPrefix('api');
  generateDocument(app);
  setupApp(app);
  const port =
    typeof config['APP_PORT'] === 'string'
      ? parseInt(config['APP_PORT'])
      : 13000;
  await app.listen(port, '0.0.0.0');
  await app.init();
}
bootstrap();
