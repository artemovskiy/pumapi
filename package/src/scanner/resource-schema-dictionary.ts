import { Schema } from '../openapi';
import { Schemas } from '../openapi/schemas';

type Tuple = [Schema, any];

export class ResourceSchemaDictionary {
  private _schemas: { [index: string]: Tuple } = {};

  setResourceSchema(schemaName: string, schema: Schema, resourceRef: any) {
    if (!this._schemas.hasOwnProperty(schemaName)) {
      this._schemas[schemaName] = [schema, resourceRef];
    } else {
      const tuple = this._schemas[schemaName];
      if (tuple[1] !== resourceRef) {
        throw new Error('invalid override');
      }
    }
  }

  getSchemas(): Schemas {
    const schemasObj = new Schemas();
    for (const schemaName in this._schemas) {
      if (!this._schemas.hasOwnProperty(schemaName)) {
        continue;
      }
      const schemaElement = this._schemas[schemaName][0];
      schemasObj.setSchema(schemaName, schemaElement);
    }
    return schemasObj;
  }
}
