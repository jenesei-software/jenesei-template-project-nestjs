import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { baseStyles, customJsCode } from './swagger-custom';

export function swaggerSetup(app: INestApplication, configService: ConfigService): void {
  const context = configService.getOrThrow<string>('server.context.path');

  const config = new DocumentBuilder()
    .setTitle('NestJS Template')
    .setVersion(process.env.NPM_PACKAGE_VERSION ?? '1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  const cleanedDocument = cleanupOpenApiDoc(document);

  SwaggerModule.setup(`${context}/swagger`, app, cleanedDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'NestJS Template API Docs',
    customCss: baseStyles,
    customJsStr: customJsCode,
  });
}
