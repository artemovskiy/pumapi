import { TypeKind } from './kind';
import { ClassType } from '../class/class-type';
import { LiteralType } from '../literal/literal-type';
import { ArrayType } from '../array/array-type';

export type TypeKindToCtor<T> =
  T extends TypeKind.LiteralType ? LiteralType :
    T extends TypeKind.Array ? ArrayType :
      T extends TypeKind.Class ? ClassType :
        Type;

export interface Type {
  getKind(): TypeKind

  // isClass(): this is ClassType;
  // isLiteral(): this is LiteralType;
  // isArray(): this is ArrayType;

  as<K extends TypeKind>(kind: K): TypeKindToCtor<K>
}
