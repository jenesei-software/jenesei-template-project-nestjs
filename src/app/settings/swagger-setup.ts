import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication, context: string) {
  const config = new DocumentBuilder().setTitle('NestJS Template').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${context}/swagger`, app, document);
}
