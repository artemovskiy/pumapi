import { Type } from '../type/type';

export interface Property {
  readonly name: string | symbol;
  readonly type: Type;
  readonly optional: boolean;
}
