import * as R from 'ramda';
import { ClassType } from './class/class-type';
import { MetadataStorage } from './metadata-storage';
import { PropertyParams, PropertyType } from './class/types';
import { Property } from './property/property.interface';
import { Type } from './type/type';
import { ArrayType as ArrayWrapper, Constructor } from '../types';
import { ArrayType } from './array/array-type';
import { LiteralType } from './literal/literal-type';

export class TypeExplorer {
  constructor(
    private readonly metadataStorage: MetadataStorage,
  ) {
  }

  getClassType(constructor: Constructor<unknown>): ClassType {
    const classMeta = this.metadataStorage.getClassMetadata(constructor.prototype);
    return new ClassType(
      R.toPairs(classMeta.getProperties())
        // @ts-ignore
        .map(([key, params]) => this.getClassProperty(constructor.prototype, key, params)),
      constructor,
    );
  }

  private getClassProperty(prototype: unknown, name: string | symbol, params: PropertyParams<unknown>): Property {
    const type = this.getClassPropertyType(prototype, name, params);

    return {
      name,
      type: this.getType(type),
      optional: params.optional ?? false,
    };
  }

  getType(type: PropertyType<unknown>): Type {
    if ((type as unknown as StringConstructor) === String) {
      return new LiteralType(String);
    }
    if ((type as unknown as NumberConstructor) === Number) {
      return new LiteralType(Number);
    }
    if ((type as unknown as BooleanConstructor) === Boolean) {
      return new LiteralType(Boolean);
    }
    if ((type as unknown as ArrayConstructor) === Array) {
      return new ArrayType(new LiteralType(Boolean));
    }
    if (type instanceof ArrayWrapper) {
      return new ArrayType(this.getType(type.ctor));
    }
    return this.getClassType(type);
  }

  private getClassPropertyType(
    prototype: unknown,
    name: string | symbol,
    params: PropertyParams<unknown>,
  ): PropertyType<unknown> {
    if (params.type) {
      return params.type;
    }
    const emittedType = Reflect.getMetadata('design:type', prototype, name);
    return emittedType;
  }
}
