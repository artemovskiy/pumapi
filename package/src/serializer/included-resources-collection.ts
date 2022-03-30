import * as JSONAPI from 'jsonapi-typescript';

import { Constructor } from '../types';
import { IdentificationExplorer, ResourceExplorer } from '../explorer';
import { RelationshipSerializer } from './relationship-serializer.interface';
import { ResourceSerializer } from './resource-serializer';

export type Related<T> = {
  ctor: Constructor<T>;
  object: T;
};

export type RelatedCollectionWithCtor<T> = {
  ctor: Constructor<T>;
  collection: Map<string, T>;
};

export class IncludedResourcesCollection {
  private readonly related = new Map<string, RelatedCollectionWithCtor<any>>();

  put<T>({ ctor, object }: Related<T>) {
    const explorer = new IdentificationExplorer(ctor);
    const collectionWithCtor = this.related.get(explorer.getType()) || {
      ctor,
      collection: new Map(),
    };
    collectionWithCtor.collection.set(String(explorer.getId(object)), object);
    if (!this.related.has(explorer.getType())) {
      this.related.set(explorer.getType(), collectionWithCtor);
    }
  }

  serialize(
    relationshipsSerializer: RelationshipSerializer,
  ): JSONAPI.ResourceObject[] {
    const all: JSONAPI.ResourceObject[] = [];
    for (const { ctor, collection } of Array.from(this.related.values())) {
      const serializer = new ResourceSerializer(new ResourceExplorer(ctor));
      for (const object of Array.from(collection.values())) {
        all.push(serializer.serialize(object, relationshipsSerializer));
      }
    }
    return all;
  }

  toJSON() {
    return Array.from(this.related.values()).map((collectionWCtor) => {
      return {
        ...collectionWCtor,
        collection: Array.from(collectionWCtor.collection.values()),
      };
    });
  }

  get empty() {
    return this.related.size == 0;
  }
}
