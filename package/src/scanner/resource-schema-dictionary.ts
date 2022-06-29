import { Schema } from '../openapi';
import { Schemas } from '../openapi/schemas';
import { ArrayType } from '../types';

type Tuple = [Schema, any];

export class ResourceSchemaDictionary {
  private _schemas: { [index: string]: Tuple } = {};

  setResourceSchema(schemaName: string, schema: Schema, resourceRef: any) {
    if (!Object.prototype.hasOwnProperty.call(this._schemas, schemaName)) {
      this._schemas[schemaName] = [schema, resourceRef];
    } else {
      const tuple = this._schemas[schemaName];
      if (!this.compareTypesRefs(tuple[1], resourceRef)) {
        throw new Error('invalid override');
      }
    }
  }

  private compareTypesRefs(a: unknown, b: unknown): boolean {
    if (a instanceof ArrayType) {
      if (b instanceof ArrayType) {
        return a.ctor === b.ctor;
      }
      return false;
    }
    return a === b;
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
