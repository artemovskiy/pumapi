import * as JSONAPI from 'jsonapi-typescript';
import * as path from 'path';

import {
  RelationshipSerializer,
  ResourceRelationshipExtended,
} from './relationship-serializer.interface';
import { IdentificationExplorer } from '../explorer';

export class RelationshipLinksSerializer implements RelationshipSerializer {
  constructor(public readonly baseUrl: string) {}

  serialize<T, R extends keyof T>({
    object,
    oCtor,
    key,
  }: ResourceRelationshipExtended<T, R>): JSONAPI.RelationshipsWithLinks {
    const relatedUrl = new URL('', this.baseUrl);
    const explorer = new IdentificationExplorer(oCtor);
    relatedUrl.pathname = path.join(
      explorer.getType(),
      String(explorer.getId(object)),
      String(key),
    );
    return {
      links: {
        related: relatedUrl.toString(),
      },
    } as JSONAPI.RelationshipsWithLinks;
  }
}
