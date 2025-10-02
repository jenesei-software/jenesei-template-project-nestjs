import { isEnvFlagEnabled } from '@common/utils/env.util';
import { ConsoleLogger } from '@nestjs/common';

export function loggerConfig(): ConsoleLogger {
  return new ConsoleLogger({
    json: isEnvFlagEnabled(process.env.LOGGER_JSON),
    colors: isEnvFlagEnabled(process.env.LOGGER_COLORS),
    timestamp: false,
  });
}
