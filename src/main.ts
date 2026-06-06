import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { AppModule } from '@/app';
import { appConfig, httpsConfig, loggerConfig } from '@/app/setup';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const httpsOptions = httpsConfig();
  const app = await NestFactory.create(AppModule, new FastifyAdapter(), {
    httpsOptions,
    logger: loggerConfig(),
  });
  const cfg = app.get<ConfigService>(ConfigService);
  const HOST = cfg.getOrThrow<string>('server.host');
  const PORT = cfg.getOrThrow<number>('server.port');
  const CONTEXT_API = cfg.getOrThrow<string>('server.context.path');
  const DOMAIN = cfg.getOrThrow<string>('server.domain');

  appConfig(app, cfg);

  await app.listen(PORT, HOST, () => {
    logger.log(`App started with domain ${DOMAIN}`);
    logger.log(`Swagger url ${CONTEXT_API}/swagger`);
    logger.log(
      `Server started on ${httpsOptions ? 'https' : 'http'}://${HOST}:${PORT}/${CONTEXT_API}`,
    );
  });
}

bootstrap().catch((err) => {
  const logger = new Logger('BootstrapError');
  logger.error('Критическая ошибка при запуске приложения:', err);
  process.exit(1);
});
