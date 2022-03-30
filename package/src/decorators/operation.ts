import { ArrayType, Constructor, InputResourceOptions } from '../types';
import { METADATA } from '../metadata';

export type ResponseResourceOptions<T> = {
  type: T extends Array<infer I> ? ArrayType<Constructor<I>> : Constructor<T>;
};

export function ResponseResource(
  options: ResponseResourceOptions<any>,
): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(
      METADATA.OPERATION.RESPONSE_RESOURCE,
      options,
      descriptor.value,
    );
  };
}

export function InputResource(
  options: Partial<InputResourceOptions>,
): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(
      METADATA.OPERATION.INPUT_RESOURCE,
      options,
      descriptor.value,
    );
  };
}
