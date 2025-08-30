import { ExceptionExtraModels } from '@errors/index';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication, configService: ConfigService) {
  const context = configService.getOrThrow<string>('server.context.path');
  const config = new DocumentBuilder()
    .setTitle('NestJS Template')
    .setVersion(process.env.NPM_PACKAGE_VERSION)
    .build();
  const extraModels = [...ExceptionExtraModels];
  const document = SwaggerModule.createDocument(app, config, { extraModels });
  SwaggerModule.setup(`${context}/swagger`, app, document);
}
