import * as R from 'ramda';

import { IdentificationExplorer } from './index';
import { METADATA } from '../metadata';
import { AttributeOptions, RelationshipDefinitions } from '../types';

export class ResourceExplorer<T> extends IdentificationExplorer<T> {
  getAttributesDefinitions(): { [P in keyof T]?: AttributeOptions } {
    const metadata: { [P in keyof T]?: Partial<AttributeOptions> } = Reflect.getMetadata(
      METADATA.RESOURCE.ATTRIBUTES,
      this.ctor.prototype,
    ) || {};
    return R.mapObjIndexed((definition, key) => {
      let { type } = definition;
      if (!type) {
        type = Reflect.getMetadata('design:type', this.ctor.prototype, key);
      }
      return {
        input: definition.input || 'optional',
        type,
      };
    }, metadata) as { [P in keyof T]?: AttributeOptions };
  }

  getRelationshipsDefinitions(): RelationshipDefinitions<T> | null {
    const relationshipsMeta = Reflect.getMetadata(
      METADATA.RESOURCE.RELATIONSHIPS,
      this.ctor.prototype,
    );
    if (
      typeof relationshipsMeta === 'undefined'
      || (typeof relationshipsMeta === 'object'
        && (relationshipsMeta === null
          || Object.keys(relationshipsMeta).length === 0))
    ) {
      return null;
    }
    if (typeof relationshipsMeta !== 'object') {
      throw new TypeError();
    }
    return R.mapObjIndexed((definition, key) => {
      let { type } = definition;
      if (!type) {
        type = Reflect.getMetadata('design:type', this.ctor.prototype, key);
      }
      return { type };
    }, relationshipsMeta as RelationshipDefinitions<T>) as RelationshipDefinitions<T>;
  }
}
