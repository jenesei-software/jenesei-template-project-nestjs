import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { enableHttps } from './app/settings/enable-https';
import { appSettings } from './app/settings/app-settings';

dotenv.config();
async function bootstrap() {
  const httpsOptions = enableHttps();
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get<ConfigService>(ConfigService);
  const HOST = configService.getOrThrow<string>('server.host');
  const PORT = configService.getOrThrow<number>('server.port');
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');
  appSettings(app, configService);
  await app.listen(PORT, HOST, () => {
    Logger.log(
      `Server started on ${httpsOptions ? 'https' : 'http'}://${HOST}:${PORT}/${CONTEXT_API}`,
      'MAIN',
    );
  });
}

bootstrap();
