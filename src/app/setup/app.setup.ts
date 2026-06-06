import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';

import { corsConfig } from './cors.setup';
import { swaggerSetup as swaggerConfig } from './swagger/swagger.setup';

export function appConfig(app: INestApplication, configService: ConfigService): void {
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');

  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix(CONTEXT_API);

  corsConfig(app, configService);
  swaggerConfig(app, configService);
}
