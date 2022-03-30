import { Schema } from './schema';

export class MediaType {
  private _type: string;
  setType(type: string) {
    this._type = type;
    return this;
  }
  getType(): string {
    return this._type;
  }

  private _schema: Schema;
  setSchema(schema: Schema) {
    this._schema = schema;
    return this;
  }

  getOpenapi() {
    return { schema: this._schema.getJsonapi() };
  }
}
