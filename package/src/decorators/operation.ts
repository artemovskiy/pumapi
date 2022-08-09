import { ArrayType, Constructor, InputResourceOptions } from '../types';
import { METADATA } from '../metadata';

export function Summary(summary: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(
      METADATA.OPERATION.SUMMARY,
      summary,
      descriptor.value,
    );
  };
}

export function Description(description: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(
      METADATA.OPERATION.DESCRIPTION,
      description,
      descriptor.value,
    );
  };
}

export function Tag(tag: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const existentTags = Reflect.getMetadata(METADATA.OPERATION.TAGS, target) || [];
    const newTags = [...existentTags, tag];
    Reflect.defineMetadata(
      METADATA.OPERATION.TAGS,
      newTags,
      descriptor.value,
    );
  };
}

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
