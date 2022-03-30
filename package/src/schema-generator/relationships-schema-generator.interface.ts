import { Constructor } from '../types';

export type ResourceRelationship<T, R extends keyof T> = {
  oCtor: Constructor<T>;
  key: R;
  rCtor: Constructor<T[R]>;
};

export interface RelationshipsSchemaGenerator {
  generateSchema<T, R extends keyof T>(
    relationship: ResourceRelationship<T, R>,
  ): any;
}
