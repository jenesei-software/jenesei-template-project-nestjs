import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppEnv } from '@/app/env';
import { envConfig } from '@/app/setup';
import { InfrastructureModules } from '@/infra';
import { DomainModules } from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [...AppEnv], envFilePath: envConfig }),
    ...InfrastructureModules,
    ...DomainModules,
  ],
})
export class AppModule {}
