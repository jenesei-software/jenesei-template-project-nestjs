import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from '@services/app.service';
import { AppController } from '@controllers/app.controller';
import server from '@env/server';
import database from '@env/database';
import { DatabasesModule } from '@modules/databases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [server, database],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
