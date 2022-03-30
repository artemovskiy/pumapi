import { DynamicModule, Module } from '@nestjs/common';
import { JSONAPI_CONFIG_TOKEN, JsonapiModuleAsyncOptions } from './types';

@Module({
  providers: [
    {
      provide: JSONAPI_CONFIG_TOKEN,
      useValue: {},
    },
  ],
})
export class JsonapiModule {
  static forRootAsync(options: JsonapiModuleAsyncOptions): DynamicModule {
    return {
      module: JsonapiModule,
      imports: options.imports,
      providers: [
        {
          provide: JSONAPI_CONFIG_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [JSONAPI_CONFIG_TOKEN],
    };
  }
}
