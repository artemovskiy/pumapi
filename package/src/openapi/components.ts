import { Schemas } from './schemas';

export class Components {
  private _schemas: Schemas;

  setSchemas(schemas: Schemas): this {
    this._schemas = schemas;
    return this;
  }

  getOpenapi() {
    return {
      schemas: this._schemas.getOpenapi(),
    };
  }
}
