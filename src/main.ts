import { AppModule } from './app/app.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { appConfig } from '@settings/app.config';
import { httpsConfig } from '@settings/https.config';
import { loggerConfig } from '@settings/logger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const httpsOptions = httpsConfig();
  const app = await NestFactory.create(AppModule, { httpsOptions, logger: loggerConfig() });
  const configService = app.get<ConfigService>(ConfigService);
  const HOST = configService.getOrThrow<string>('server.host');
  const PORT = configService.getOrThrow<number>('server.port');
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');
  const DOMAIN = configService.getOrThrow<string>('server.domain');

  appConfig(app, configService);

  await app.listen(PORT, HOST, () => {
    logger.log(`App started with domain ${DOMAIN}`);
    logger.log(`Swagger url ${CONTEXT_API}/swagger`);
    logger.log(
      `Server started on ${httpsOptions ? 'https' : 'http'}://${HOST}:${PORT}/${CONTEXT_API}`,
    );
  });
}

bootstrap();
