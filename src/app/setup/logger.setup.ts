import { ConsoleLogger } from '@nestjs/common';

import { isEnvFlagEnabled } from '@/common/utils';

export function loggerConfig(): ConsoleLogger {
  return new ConsoleLogger({
    json: isEnvFlagEnabled(process.env.LOGGER_JSON ?? 'false'),
    colors: isEnvFlagEnabled(process.env.LOGGER_COLORS ?? 'true'),
    timestamp: false,
  });
}
