import { enableBasicAuth } from './basic-auth.config';
import { corsConfig } from './cors.config';
import { swaggerSetup as swaggerConfig } from './swagger.config';
import { CustomExceptionFilter } from '@common/filters/http-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

export function appConfig(app: INestApplication, configService: ConfigService) {
  const CONTEXT_API = configService.getOrThrow<string>('server.context.path');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Автоматически удаляет неразрешенные поля
      forbidNonWhitelisted: true, // Бросает ошибку при наличии лишних полей
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix(CONTEXT_API);
  app.useGlobalFilters(new CustomExceptionFilter());

  enableBasicAuth(configService);
  corsConfig(app, configService);
  swaggerConfig(app, configService);
}
