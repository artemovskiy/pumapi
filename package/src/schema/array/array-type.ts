import { Type } from '../type/type';
import { TypeKind } from '../type/kind';
import { LiteralType } from '../literal/literal-type';
import { ClassType } from '../class/class-type';
import { BaseType } from '../base-type';

export class ArrayType extends BaseType implements Type {
  getKind(): TypeKind {
    return TypeKind.Array;
  }

  constructor(
    private readonly elementType: Type,
  ) {
    super();
  }

  getElementType(): Type {
    return this.elementType;
  }

  isClass(): this is ClassType {
    return false;
  }

  isArray(): this is ArrayType {
    return true;
  }

  isLiteral(): this is LiteralType {
    return false;
  }
}
