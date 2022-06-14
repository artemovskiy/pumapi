import { Type } from '../type/type';
import { TypeKind } from '../type/kind';
import { ArrayType } from '../array/array-type';
import { ClassType } from '../class/class-type';
import { BaseType } from '../base-type';

export type LiteralConstructor = StringConstructor | NumberConstructor | BooleanConstructor;

export class LiteralType extends BaseType implements Type {
  getKind(): TypeKind {
    return TypeKind.LiteralType;
  }

  constructor(
    private readonly reference: LiteralConstructor,
  ) {
    super();
  }

  getConstructorReference() {
    return this.reference;
  }

  isClass(): this is ClassType {
    return false;
  }

  isArray(): this is ArrayType {
    return false;
  }

  isLiteral(): this is LiteralType {
    return true;
  }
}
