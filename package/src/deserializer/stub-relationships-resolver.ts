import {
  RelationshipResolutionParams,
  RelationshipResolver,
} from './relationship-resolver.interface';

export class StubRelationshipsResolver implements RelationshipResolver {
  resolveRelationship<T, K extends keyof T>(
    params: RelationshipResolutionParams<T, K>,
  ): Promise<T[K]> {
    return Promise.resolve(params.related as unknown as T[K]);
  }
}
