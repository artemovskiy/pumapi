import { Schema } from './schema';

export class Schemas {
  private _schemas: Record<string, Schema> = {};

  setSchema(identifier: string, schema: Schema): this {
    this._schemas[identifier] = schema;
    return this;
  }

  getOpenapi() {
    const result = {};
    for (const key in this._schemas) {
      if (Object.prototype.hasOwnProperty.call(this._schemas, key)) {
        result[key] = this._schemas[key].getJsonapi();
      }
    }
    return result;
  }
}
