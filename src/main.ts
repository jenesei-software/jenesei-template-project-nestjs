import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.getOrThrow<number>('server.port');
  const HOST = configService.getOrThrow<string>('server.host');
  const CONTEXT_PATH = configService.getOrThrow<string>('server.contextPath');
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(CONTEXT_PATH);
  const config = new DocumentBuilder().setTitle('Template app').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${CONTEXT_PATH}/swagger`, app, document);

  await app.listen(PORT, HOST, () => {
    Logger.log(`Server started on http://${HOST}:${PORT}`, 'MAIN');
  });
}

bootstrap();
