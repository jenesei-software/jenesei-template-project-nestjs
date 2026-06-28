import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppEnv, envConfig } from '@/app';
import { Guards, Interceptors } from '@/common';
import { InfrastructureModules } from '@/infra';
import { DomainModules } from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [...AppEnv], envFilePath: envConfig }),
    ...InfrastructureModules,
    ...DomainModules,
  ],
  providers: [...Interceptors, ...Guards],
})
export class AppModule {}
