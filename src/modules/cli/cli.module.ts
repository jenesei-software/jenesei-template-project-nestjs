import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { CliHttpAdapter } from './adapter';
import { CliCommandRegistryService } from './domain';

@Module({
  imports: [DiscoveryModule],
  controllers: [CliHttpAdapter],
  providers: [CliCommandRegistryService],
})
export class CliModule {}
