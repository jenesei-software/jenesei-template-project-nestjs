import { isEnvFlagEnabled } from '@common/utils/env.util';
import { Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';

export function httpsConfig(): { key: Buffer; cert: Buffer } | undefined {
  const useHttps = isEnvFlagEnabled(process.env.HTTPS_ENABLED);
  if (useHttps) {
    try {
      return {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT),
      };
    } catch (error) {
      Logger.error(`Error loading SSL certificates: ${error?.message}`, 'EnableHttps');
      if (process.env.NODE_ENV != 'production') {
        throw new Error('SSL certificates are required for production');
      }
    }
  }
}
