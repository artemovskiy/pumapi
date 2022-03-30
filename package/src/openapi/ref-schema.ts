import { Schema } from './schema';

export class RefSchema extends Schema {
  setRef(ref: string) {
    this._data = {
      $ref: ref,
    };
    return this;
  }
}
