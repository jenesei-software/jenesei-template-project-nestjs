import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { HttpExceptionFilter, ResponseWrapperInterceptor } from '@/common';
import { corsConfig } from './cors.setup';
import { swaggerSetup as swaggerConfig } from './swagger';

export function appConfig(app: INestApplication, configService: ConfigService): void {
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');

  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix(CONTEXT_API);
  app.useGlobalInterceptors(app.get(ResponseWrapperInterceptor));
  app.useGlobalFilters(new HttpExceptionFilter());

  corsConfig(app, configService);
  swaggerConfig(app, configService);
}
