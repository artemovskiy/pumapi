import * as JSONAPI from 'jsonapi-typescript';

import { IdentificationExplorer } from '../explorer';

export class ResourceIdentifierSerializer<T> {
  constructor(protected readonly explorer: IdentificationExplorer<T>) {}

  serialize(object: T): JSONAPI.ResourceIdentifierObject {
    const id = object[this.explorer.getIdKey()];
    return {
      id,
      type: this.explorer.getType(),
    };
  }
}
