import * as JSONAPI from 'jsonapi-typescript';
import * as R from 'ramda';

import { ResourceIdentifierSerializer } from './resource-identifier-serializer';
import { RelationshipSerializer } from './relationship-serializer.interface';
import { ResourceExplorer } from '../explorer';

export class ResourceSerializer<T> {
  private readonly identifierSerializer: ResourceIdentifierSerializer<T>;

  constructor(private readonly explorer: ResourceExplorer<T>) {
    this.identifierSerializer = new ResourceIdentifierSerializer(this.explorer);
  }

  serialize(
    object: T,
    relationshipSerializer: RelationshipSerializer,
  ): JSONAPI.ResourceObject & JSONAPI.ResourceIdentifierObject {
    const identifier = this.identifierSerializer.serialize(object);
    const attributes = this.getAttributesObject(object);
    const relationships = this.getRelationshipsObject(
      object,
      relationshipSerializer,
    );
    return {
      ...identifier,
      attributes,
      relationships,
    };
  }

  private getAttributesObject(object: T) {
    const attributeDefinitions = this.explorer.getAttributesDefinitions();
    return R.mapObjIndexed((_, key) => object[key], attributeDefinitions);
  }

  private getRelationshipsObject(
    object: T,
    relationshipSerializer: RelationshipSerializer,
  ): JSONAPI.RelationshipsObject {
    const relationshipsDefinitions = this.explorer.getRelationshipsDefinitions();
    if (!relationshipsDefinitions) {
      return undefined;
    }
    return R.mapObjIndexed(({ type }, key) => relationshipSerializer.serialize({
      object,
      oCtor: this.explorer.ctor,
      key: key as keyof T,
      rCtor: type,
      related: object[key],
    }), relationshipsDefinitions);
  }
}
