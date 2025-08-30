import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { enableHttps } from '@settings/https';
import { appSettings } from '@settings/app-settings';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const httpsOptions = enableHttps();
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get<ConfigService>(ConfigService);
  const HOST = configService.getOrThrow<string>('server.host');
  const PORT = configService.getOrThrow<number>('server.port');
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');
  const DOMAIN = configService.getOrThrow<string>('server.domain');

  appSettings(app, configService);

  await app.listen(PORT, HOST, () => {
    logger.log(`App started with domain ${DOMAIN}`);
    logger.log(`Swagger url ${CONTEXT_API}/swagger`);
    logger.log(
      `Server started on ${httpsOptions ? 'https' : 'http'}://${HOST}:${PORT}/${CONTEXT_API}`,
    );
  });
}

bootstrap();
