export interface IConfig {
  baseUrl: string;
}

export const JSONAPI_CONFIG_TOKEN = 'JSONAPI_CONFIG_TOKEN';

export interface JsonapiModuleAsyncOptions {
  useFactory?: (...args: any[]) => Promise<IConfig> | IConfig;
  inject?: any[];
  imports?: any[];
}
