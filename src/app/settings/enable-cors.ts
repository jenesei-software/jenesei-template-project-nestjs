import { INestApplication, InternalServerErrorException } from '@nestjs/common';

export function enableCors(app: INestApplication, context: string) {
  if (['production', 'test'].includes(process.env.NODE_ENV)) {
    app.enableCors({
      credentials: true,
      origin: (origin: string, callback: any) => {
        if (!origin || new RegExp(`^https?:\\/\\/(.*\\.)?${context}(:\\d+)?$`).test(origin)) {
          callback(null, true);
        } else {
          callback(new InternalServerErrorException('Not allowed by CORS'));
        }
      },
    });
  } else {
    app.enableCors({
      credentials: true,
      origin: '*',
    });
  }
}
