import { isEnvFlagEnabled } from '@common/utils/env.util';

export default () => ({
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT) || 3000,
    context: { path: process.env.CONTEXT_API || 'api' },
    https: isEnvFlagEnabled(process.env.HTTPS_ENABLED) || false,
    cors: isEnvFlagEnabled(process.env.CORS_ENABLED) || false,
    domain: process.env.DOMAIN || 'localhost',
    ssl: {
      key: process.env.SSL_KEY || undefined,
      cert: process.env.SSL_CERT || undefined,
    },
    basic: {
      auth: {
        enabled: process.env.BASIC_AUTH_ENABLED ?? false,
        username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD,
      },
    },
  },
});
