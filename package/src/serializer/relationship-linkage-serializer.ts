import * as JSONAPI from 'jsonapi-typescript';

import {
  RelationshipSerializer,
  ResourceRelationshipExtended,
} from './relationship-serializer.interface';
import { ArrayType, Constructor } from '../types';
import { IncludedResourcesCollection } from './included-resources-collection';
import { ResourceIdentifierSerializer } from './resource-identifier-serializer';
import { IdentificationExplorer } from '../explorer';

export class RelationshipLinkageSerializer implements RelationshipSerializer {
  constructor(private readonly collection: IncludedResourcesCollection) {}

  serialize<T, R extends keyof T>({
    rCtor,
    related,
  }: ResourceRelationshipExtended<T, R>): JSONAPI.RelationshipsWithData {
    if (rCtor instanceof ArrayType) {
      if (
        typeof related === 'undefined'
        || related === null
        || !(related as unknown as any[]).length
      ) {
        return {
          data: [],
        };
      }
      const serializer = this.getRelationshipSerializer(rCtor.ctor);
      return {
        data: (related as unknown as any[]).map((item) => {
          this.collection.put({ object: item, ctor: rCtor.ctor });
          return serializer.serialize(item);
        }),
      } as JSONAPI.RelationshipsWithData;
    }
    if (typeof related === 'undefined' || related === null) {
      return {
        data: null,
      };
    }
    this.collection.put({ object: related, ctor: rCtor });
    const serializer = this.getRelationshipSerializer(rCtor);
    return {
      data: serializer.serialize(related),
    } as JSONAPI.RelationshipsWithData;
  }

  private getRelationshipSerializer<F>(
    ctor: Constructor<F>,
  ): ResourceIdentifierSerializer<F> {
    return new ResourceIdentifierSerializer<F>(
      new IdentificationExplorer<F>(ctor),
    );
  }
}
