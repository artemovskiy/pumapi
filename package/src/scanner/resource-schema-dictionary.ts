import { Schema } from '../openapi';
import { Schemas } from '../openapi/schemas';

type Tuple = [Schema, any];

export class ResourceSchemaDictionary {
  private _schemas: { [index: string]: Tuple } = {};

  setResourceSchema(schemaName: string, schema: Schema, resourceRef: any) {
    if (!Object.prototype.hasOwnProperty.call(this._schemas, schemaName)) {
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
      if (Object.prototype.hasOwnProperty.call(this._schemas, schemaName)) {
        const schemaElement = this._schemas[schemaName][0];
        schemasObj.setSchema(schemaName, schemaElement);
      }
    }
    return schemasObj;
  }
}
