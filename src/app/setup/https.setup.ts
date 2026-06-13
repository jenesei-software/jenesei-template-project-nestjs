import { readFileSync } from 'node:fs';
import { Logger } from '@nestjs/common';

import { isEnvFlagEnabled } from '@/common/utils';

export function httpsConfig(): { key: Buffer; cert: Buffer } | undefined {
  const useHttps = isEnvFlagEnabled(process.env.HTTPS_ENABLED ?? 'false');
  if (useHttps) {
    try {
      return {
        key: readFileSync(process.env.SSL_KEY ?? ''),
        cert: readFileSync(process.env.SSL_CERT ?? ''),
      };
    } catch (e: unknown) {
      Logger.error(`Error loading SSL certificates: ${e}`, 'EnableHttps');
      if (process.env.NODE_ENV !== 'production') {
        throw new Error('SSL certificates are required for production');
      }
    }
  }
}
