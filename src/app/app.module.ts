import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import database from './settings/env/database';
import server from './settings/env/server';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [server, database],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
