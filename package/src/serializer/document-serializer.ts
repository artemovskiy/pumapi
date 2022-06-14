import * as JSONAPI from 'jsonapi-typescript';

import { ArrayType, Constructor } from '../types';
import { IncludedResourcesCollection } from './included-resources-collection';
import { ResourceSerializer } from './resource-serializer';
import { RelationshipSerializer } from './relationship-serializer.interface';
import { RelationshipLinkageSerializer } from './relationship-linkage-serializer';
import { RelationshipLinksSerializer } from './relationship-links-serializer';
import { ResourceExplorer } from '../explorer';

export class DocumentSerializer<T> {
  constructor(
    protected readonly ctor: Constructor<T> | ArrayType<Constructor<T>>,
    private readonly baseUrl: string,
  ) {}

  serialize(content: T): JSONAPI.Document {
    const includedResourcesCollection = new IncludedResourcesCollection();
    const dataRelationshipsSerializer: RelationshipSerializer = new RelationshipLinkageSerializer(
      includedResourcesCollection,
    );
    const data = this.getData(content, dataRelationshipsSerializer);
    const includedRelationshipsSerializer = new RelationshipLinksSerializer(
      this.baseUrl,
    );
    if (includedResourcesCollection.empty) {
      return {
        data,
      };
    }
    const included = includedResourcesCollection.serialize(
      includedRelationshipsSerializer,
    );
    return { data, included };
  }

  private getData(content: T, includeCollection: RelationshipSerializer) {
    if (this.ctor instanceof ArrayType) {
      const resourceSerializer = new ResourceSerializer(
        new ResourceExplorer(this.ctor.ctor),
      );
      return (content as unknown as any[]).map((item) => resourceSerializer.serialize(item, includeCollection));
    }
    const resourceSerializer = new ResourceSerializer(
      new ResourceExplorer(this.ctor),
    );
    return resourceSerializer.serialize(content, includeCollection);
  }
}
