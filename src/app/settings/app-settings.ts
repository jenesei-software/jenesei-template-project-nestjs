import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { swaggerSetup } from './swagger-setup';
import { enableCors } from './enable-cors';

export function appSettings(app: INestApplication, configService: ConfigService) {
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
  app.useGlobalFilters();
  enableCors(app, CONTEXT_API);
  swaggerSetup(app, CONTEXT_API);
}
