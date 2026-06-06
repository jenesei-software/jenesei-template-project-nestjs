import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type CorsCallback = (err: Error | null, allow?: boolean) => void;

export function corsConfig(app: INestApplication, configService: ConfigService): void {
  const DOMAIN = configService.getOrThrow<string>('server.domain');
  const CORS_ENABLED = configService.getOrThrow<boolean>('server.cors');

  if (CORS_ENABLED) {
    app.enableCors({
      credentials: true,
      origin: (origin: string | undefined, callback: CorsCallback) => {
        if (!origin || new RegExp(`^https?:\\/\\/(.*\\.)?${DOMAIN}(:\\d+)?$`).test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
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
