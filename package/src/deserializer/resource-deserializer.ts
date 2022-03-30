import * as JSONAPI from 'jsonapi-typescript';

import { ResourceExplorer } from '../explorer';
import { ARelationshipDefinition, AttributeOptions, CGIOption } from '../types';
import { RelationshipResolver } from './relationship-resolver.interface';

export class ResourceDeserializer<T> {
  protected readonly object: T;

  constructor(
    protected readonly resource: JSONAPI.ResourceObject,
    protected readonly explorer: ResourceExplorer<T>,
    protected readonly cgiOption: CGIOption,
    private readonly relationshipResolver: RelationshipResolver,
  ) {
    this.object = new explorer.ctor();
  }

  async deserialize(): Promise<T> {
    this.validateType();
    this.setIdentifierIfNeed();
    this.setObjectAttributes();
    await this.setObjectRelationships();
    return this.object;
  }

  private validateType() {
    if (
      typeof this.resource.type !== 'string' ||
      this.resource.type !== this.explorer.getType()
    ) {
      throw new TypeError(
        'Invalid resource type: ' +
          this.resource.type +
          '. Expected: ' +
          this.explorer.getType(),
      );
    }
  }

  private setIdentifierIfNeed() {
    if (this.cgiOption === 'require' || this.cgiOption === 'allow') {
      if (
        this.cgiOption === 'require' ||
        typeof this.resource.id === 'undefined' ||
        this.resource.id === null
      ) {
        throw new Error('no id presented while required');
      }
      this.setObjectId(this.resource.id);
    }
  }

  private setObjectId(id: string | number) {
    this.object[this.explorer.getIdKey()] = id;
  }

  private setObjectAttributes() {
    const definitions = this.explorer.getAttributesDefinitions();
    for (const key in definitions) {
      if (definitions.hasOwnProperty(key)) {
        this.setObjectAttribute(key, definitions[key]);
      }
    }
  }

  private setObjectAttribute<K extends keyof T>(
    key: K,
    definition: AttributeOptions,
  ) {
    this.object[key] = this.resource.attributes[
      key as string
    ] as unknown as T[K];
  }

  private async setObjectRelationships() {
    const definitions = this.explorer.getRelationshipsDefinitions();
    if (!definitions || typeof this.resource.relationships === 'undefined') {
      return;
    }
    const promises = Object.keys(definitions).reduce((acc, key) => {
      return [
        ...acc,
        this.setObjectRelationship(key as keyof T, definitions[key]),
      ];
    }, []);
    await Promise.all(promises);
  }

  private async setObjectRelationship<K extends keyof T>(
    key: K,
    definition: ARelationshipDefinition<any>,
  ) {
    const value = this.resource.relationships[
      key as string
    ] as JSONAPI.RelationshipsWithData;
    if (
      typeof value !== 'object' ||
      !('data' in value) ||
      typeof value.data !== 'object'
    ) {
      throw new TypeError('expected relationship with data');
    }
    this.object[key] = await this.relationshipResolver.resolveRelationship({
      oCtor: this.explorer.ctor,
      key,
      related: value.data,
      rCtor: definition.type,
    });
  }
}
