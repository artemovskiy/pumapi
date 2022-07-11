import { METADATA } from '../metadata';
import { ArrayType, AttributeOptions, Constructor } from '../types';

export type ResourceOptions = {
  type?: string;
  idKey?: string;
};

export function Resource(options?: ResourceOptions): ClassDecorator {
  return (target) => {
    const safeOptions = options || {};
    if ('type' in safeOptions) {
      Reflect.defineMetadata(METADATA.RESOURCE.TYPE, safeOptions.type, target);
    }
    if ('idKey' in safeOptions) {
      Reflect.defineMetadata(
        METADATA.RESOURCE.ID_KEY,
        safeOptions.idKey,
        target,
      );
    }
  };
}

export function Attribute(
  options?: Partial<AttributeOptions>,
): PropertyDecorator {
  const optionsSafe = options || {};
  return (target: unknown, propertyKey: string | symbol) => {
    const attributes = Reflect.getMetadata(METADATA.RESOURCE.ATTRIBUTES, target) || {};
    Reflect.defineMetadata(
      METADATA.RESOURCE.ATTRIBUTES,
      { ...attributes, [propertyKey]: optionsSafe },
      target,
    );
  };
}

export type RelationshipOptions = {
  type?: () => Constructor<any> | ArrayType<Constructor<any>>;
};

export function Relationship(options?: RelationshipOptions): PropertyDecorator {
  const optionsSafe = options || {};
  return (target: unknown, propertyKey: string | symbol) => {
    const relationships = Reflect.getMetadata(METADATA.RESOURCE.RELATIONSHIPS, target) || {};
    Reflect.defineMetadata(
      METADATA.RESOURCE.RELATIONSHIPS,
      { ...relationships, [propertyKey]: optionsSafe },
      target,
    );
  };
}
