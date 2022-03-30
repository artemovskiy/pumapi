import * as JSONAPI from 'jsonapi-typescript';

import { Constructor } from '../types';

export type ResourceRelationshipExtended<T, R extends keyof T> = {
  object: T;
  oCtor: Constructor<T>;
  key: R;
  rCtor: Constructor<T[R]>;
  related: T[R];
};

export interface RelationshipSerializer {
  serialize<T, R extends keyof T>(
    relationship: ResourceRelationshipExtended<T, R>,
  ): JSONAPI.RelationshipObject;
}
