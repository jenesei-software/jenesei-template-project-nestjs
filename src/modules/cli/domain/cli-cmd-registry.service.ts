import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { CLI_COMMAND_METADATA_KEY, CliCommandOptions, ICliCommand } from '@/common';

@Injectable()
export class CliCommandRegistryService implements OnModuleInit {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  private readonly registry = new Map<string, ICliCommand>();
  private readonly logger = new Logger(CliCommandRegistryService.name);

  public async onModuleInit(): Promise<void> {
    const providers = this.discovery.getProviders();

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const metadata = this.reflector.get<CliCommandOptions>(CLI_COMMAND_METADATA_KEY, metatype);

      if (metadata) {
        this.registry.set(metadata.name, instance as ICliCommand);
        this.logger.log(`Успешно добавлена команда: ${metadata.name}`);
      }
    }
  }

  public get(commandName: string): ICliCommand | undefined {
    return this.registry.get(commandName);
  }
}
