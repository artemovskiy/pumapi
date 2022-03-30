import * as JSONAPI from 'jsonapi-typescript';

import { Constructor } from '../types';

export type RelationshipResolutionParams<T, K extends keyof T> = {
  oCtor: Constructor<T>;
  key: K;
  related: JSONAPI.ResourceLinkage;
  rCtor: Constructor<T[K]>;
};

export interface RelationshipResolver {
  resolveRelationship<T, K extends keyof T>(
    params: RelationshipResolutionParams<T, K>,
  ): Promise<T[K]>;
}
