import { ArrayType, Constructor } from '../../types';

export type PropertyType<T> = T extends Array<infer I> ? ArrayType<Constructor<I>> : Constructor<T>;

export interface PropertyParams<T> {
  type: PropertyType<T>
  optional: boolean
}

export type AnyInstance = Record<string | symbol, any>;
