import { Type, TypeKindToCtor } from './type/type';
import { TypeKind } from './type/kind';

export abstract class BaseType implements Type {
  as<K extends TypeKind>(kind: K): TypeKindToCtor<K> {
    if (kind !== this.getKind()) {
      throw new TypeError('wrong kind');
    }
    return this as unknown as TypeKindToCtor<K>;
  }

  public abstract getKind(): TypeKind;
}
