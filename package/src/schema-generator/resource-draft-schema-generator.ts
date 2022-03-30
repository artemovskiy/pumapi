import * as R from 'ramda';

import { ResourceExplorer } from '../explorer';
import { RelationshipsSchemaGenerator } from './relationships-schema-generator.interface';
import { AttributeOptions, CGIOption } from '../types';
import { ResourceSchemaGenerator } from './resource-schema-generator';
import { ResourcePatchSchemaGenerator } from './resource-patch-schema-generator';

export class ResourceDraftSchemaGenerator<
  T,
> extends ResourcePatchSchemaGenerator<T> {
  constructor(
    explorer: ResourceExplorer<T>,
    relationshipsSchemaGenerator: RelationshipsSchemaGenerator,
    private readonly cgiOption: CGIOption,
  ) {
    super(explorer, relationshipsSchemaGenerator);
  }

  protected setIdentification() {
    super.setIdentification();
    if (this.cgiOption === 'deny') {
      delete this.schema.properties.id;
    }
  }

  protected setAttributesObject() {
    super.setAttributesObject();
    const attributesDefinitions = this.explorer.getAttributesDefinitions();
    if (!attributesDefinitions) {
      return;
    }
    const required = [];
    for (const key in attributesDefinitions) {
      if (
        attributesDefinitions.hasOwnProperty(key) &&
        attributesDefinitions[key].input === 'required'
      ) {
        required.push(key);
      }
    }
    this.schema.properties.attributes.required = required;
  }

  protected buildRequiredPropsList() {
    this.schema.required = ['type'];
    if (this.cgiOption === 'require') {
      this.schema.required.push('id');
    }
  }
}
