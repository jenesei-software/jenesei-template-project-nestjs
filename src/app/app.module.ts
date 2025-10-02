import { CustomModulesRegistry } from '@modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from '@settings/env.config';
import { AppEnv } from 'src/app/env';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [...AppEnv], envFilePath: envConfig }),
    ...CustomModulesRegistry,
  ],
})
export class AppModule {}
