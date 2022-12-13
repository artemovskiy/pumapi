import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasicCommand } from './cli-module/basic-comand';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './domain/shop.schema';
import { SeedShopsCommand } from './cli-module/seed-shops';
import { JsonapiModule } from 'pumapi';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@localhost:27018/admin'),
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    JsonapiModule.forRootAsync({
      useFactory: () =>
        Promise.resolve({
          baseUrl: 'http://localhost:3000',
        }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, BasicCommand, SeedShopsCommand],
})
export class AppModule {}
