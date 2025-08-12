import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from '@services/app.service';
import { AppController } from '@controllers/app.controller';
import { CustomModulesRegistry } from '@modules';
import { AppEnv } from '@settings/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...AppEnv],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ...CustomModulesRegistry,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
