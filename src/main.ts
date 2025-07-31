import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Color } from '@common/enums/colors';
import { enableHttps } from '@settings/enable-https';
import { appSettings } from '@settings/app-settings';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const httpsOptions = enableHttps();
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get<ConfigService>(ConfigService);
  const HOST = configService.getOrThrow<string>('server.host');
  const PORT = configService.getOrThrow<number>('server.port');
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');
  const DOMAIN = configService.getOrThrow<string>('server.domain');
  appSettings(app, configService);
  await app.listen(PORT, HOST, () => {
    Logger.log(`App started with domain ${Color.FgYellow}${DOMAIN}`, 'Bootstrap');
    Logger.log(`Swagger url ${Color.FgYellow}${CONTEXT_API}/swagger`, 'Bootstrap');
    Logger.log(
      `Server started on ${Color.FgYellow}${httpsOptions ? 'https' : 'http'}://${HOST}:${PORT}/${CONTEXT_API}`,
      'Bootstrap',
    );
  });
}

bootstrap();
