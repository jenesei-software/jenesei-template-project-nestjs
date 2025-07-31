import { GeneralExceptions } from '@errors/general.exception';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication, context: string) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Template')
    .setVersion(process.env.NPM_PACKAGE_VERSION)
    .build();
  const extraModels = [...GeneralExceptions];
  const document = SwaggerModule.createDocument(app, config, { extraModels });
  SwaggerModule.setup(`${context}/swagger`, app, document);
}
