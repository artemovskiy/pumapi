import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JsonapiPlugin } from 'nest-json-api';
import { OpenAPIV3 } from 'openapi-types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const partDocument = JsonapiPlugin.scan(app);
  const document: OpenAPIV3.Document = {
    ...partDocument,
    info: {
      title: '',
      version: '0.0.1',
    },
  };
  JsonapiPlugin.setup(app, document);
  await app.listen(3000);
}
bootstrap();
