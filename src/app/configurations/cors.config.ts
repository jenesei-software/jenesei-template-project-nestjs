import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function corsConfig(app: INestApplication, configService: ConfigService) {
  const DOMAIN = configService.getOrThrow<string>('server.domain');
  const CORS_ENABLED = configService.getOrThrow<boolean>('server.cors');

  if (CORS_ENABLED) {
    app.enableCors({
      credentials: true,
      origin: (origin: string, callback: any) => {
        if (!origin || new RegExp(`^https?:\\/\\/(.*\\.)?${DOMAIN}(:\\d+)?$`).test(origin)) {
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
