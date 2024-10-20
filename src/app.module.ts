import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import database from './config/database';
import server from './config/server';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [server, database] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
