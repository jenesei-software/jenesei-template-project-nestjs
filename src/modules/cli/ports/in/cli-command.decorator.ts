import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

export const CLI_COMMAND_METADATA_KEY = 'cli:command_metadata';

export interface CliCommandOptions {
  name: string;
  description?: string;
}

export function CliCommand(
  options: CliCommandOptions,
): <TFunction extends new (...args: unknown[]) => unknown, Y>(
  target: TFunction | object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void {
  return applyDecorators(Injectable(), SetMetadata(CLI_COMMAND_METADATA_KEY, options));
}
