import { readFileSync } from 'node:fs';

export function enableHttps(): { key: Buffer; cert: Buffer } | undefined {
  const useHttps = process.env.HTTPS_ENABLED == 'true' ? true : false;
  if (useHttps) {
    try {
      return {
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT),
      };
    } catch (error) {
      console.error('Error loading SSL certificates:', error);
      if (process.env.NODE_ENV != 'production') {
        throw new Error('SSL certificates are required for production');
      }
    }
  }
}
