import { Type } from '../type/type';
import { TypeKind } from '../type/kind';
import { Property } from '../property/property.interface';
import { Constructor } from '../../types';
import { ArrayType } from '../array/array-type';
import { LiteralType } from '../literal/literal-type';
import { BaseType } from '../base-type';

export class ClassType extends BaseType implements Type {
  getKind(): TypeKind {
    return TypeKind.Class;
  }

  constructor(
    private readonly properties: Property[],
    private readonly reference: Constructor<unknown>,
  ) {
    super();
  }

  getProperties(): Property[] {
    return this.properties;
  }

  getProperty(name: string): Property {
    const found = this.properties.find((prop) => prop.name === name);
    if (!found) {
      throw new TypeError(`Property: '${name}' not found on the class`);
    }
    return found;
  }

  getConstructorReference(): Constructor<unknown> {
    return this.reference;
  }

  isClass(): this is ClassType {
    return true;
  }

  isArray(): this is ArrayType {
    return false;
  }

  isLiteral(): this is LiteralType {
    return false;
  }
}
