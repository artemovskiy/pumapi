import * as R from 'ramda';

import { ResourceExplorer } from '../explorer';
import { RelationshipsSchemaGenerator } from './relationships-schema-generator.interface';
import { ArrayType, Constructor } from '../types';

export class ResourceSchemaGenerator<T> {
  protected schema: any;

  constructor(
    protected readonly explorer: ResourceExplorer<T>,
    private readonly relationshipsSchemaGenerator: RelationshipsSchemaGenerator,
  ) {}

  buildResourceSchema() {
    this.schema = {
      type: 'object',
      properties: {
        relationships: this.getRelationshipsObjectSchema(),
      },
    };
    this.setIdentification();
    this.setAttributesObject();
    return this.schema;
  }

  protected generateAttributeSchema(
    type: Constructor<T> | ArrayType<Constructor<T>>,
  ) {
    if ((type as unknown as StringConstructor) === String) {
      return { type: 'string' };
    }
    if ((type as unknown as NumberConstructor) === Number) {
      return { type: 'number' };
    }
    if ((type as unknown as BooleanConstructor) === Boolean) {
      return { type: 'boolean' };
    }
    return { type: 'object' };
  }

  protected setIdentification() {
    this.schema.properties.id = {
      type: 'string',
    };
    this.schema.properties.type = {
      type: 'string',
      enum: [this.explorer.getType()],
    };
  }

  protected setAttributesObject() {
    const attributesDefinitions = this.explorer.getAttributesDefinitions();
    const properties = R.mapObjIndexed(
      ({ type }) => this.generateAttributeSchema(type),
      attributesDefinitions,
    );
    this.schema.properties.attributes = {
      type: 'object',
      properties,
    };
  }

  private getRelationshipsObjectSchema() {
    const relationshipsDefinitions =
      this.explorer.getRelationshipsDefinitions();
    if (!relationshipsDefinitions) {
      return undefined;
    }
    return {
      type: 'object',
      properties: R.mapObjIndexed(
        (definition, key) =>
          this.relationshipsSchemaGenerator.generateSchema({
            oCtor: this.explorer.ctor,
            rCtor: definition.type,
            key: key as keyof T,
          }),
        relationshipsDefinitions,
      ),
    };
  }
}
