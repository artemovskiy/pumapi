import { Schema } from '../openapi';
import { Schemas } from '../openapi/schemas';
import { ArrayType } from '../types';

export class ResourceSchemaDictionary {
  private _schemas: { [index: string]: { [index:number]: Schema } } = {};

  setResourceSchema(schemaName: string, schema: Schema, resourceRef: any): string {
    const variants = this.getSchemasByName(schemaName);
    const nextNumber = Object.keys(variants).length;
    const nextId = schemaName + nextNumber;
    variants[nextNumber] = schema;
    return nextId;
  }

  private getSchemasByName(name: string): { [index:number]: Schema } {
    if (!Object.prototype.hasOwnProperty.call(this._schemas, name)) {
      this._schemas[name] = {};
    }
    return this._schemas[name];
  }

  getSchemas(): Schemas {
    const schemasObj = new Schemas();
    for (const schemaName in this._schemas) {
      if (Object.prototype.hasOwnProperty.call(this._schemas, schemaName)) {
        const variants = this._schemas[schemaName];
        for (const varinatNumber in variants) {
          if (Object.prototype.hasOwnProperty.call(variants, varinatNumber)) {
            const variant = variants[varinatNumber];
            schemasObj.setSchema(schemaName + varinatNumber, variant);
          }
        }
      }
    }
    return schemasObj;
  }
}
