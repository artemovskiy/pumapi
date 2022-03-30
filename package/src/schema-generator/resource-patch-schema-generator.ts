import * as R from 'ramda';

import { AttributeOptions } from '../types';
import { ResourceSchemaGenerator } from './resource-schema-generator';

export class ResourcePatchSchemaGenerator<
  T,
> extends ResourceSchemaGenerator<T> {
  buildResourceSchema() {
    super.buildResourceSchema();
    this.buildRequiredPropsList();
    return this.schema;
  }
  protected setAttributesObject() {
    const attributesDefinitions = this.explorer.getAttributesDefinitions();
    if (!attributesDefinitions) {
      return undefined;
    }
    const properties = R.compose(
      R.mapObjIndexed(({ type }) => this.generateAttributeSchema(type)),
      R.pickBy(({ input }: AttributeOptions) => input !== 'disabled'),
    )(attributesDefinitions);
    this.schema.properties.attributes = {
      type: 'object',
      properties,
    };
  }

  protected buildRequiredPropsList() {
    this.schema.required = ['id', 'type'];
  }
}
