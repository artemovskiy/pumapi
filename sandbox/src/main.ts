import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JsonapiPlugin } from 'nest-json-api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await JsonapiPlugin.init(app);
  await app.listen(3000);
}
bootstrap();
