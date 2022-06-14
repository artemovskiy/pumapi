import { ResourceSchemaGeneratorFactory } from '../schema-generator/resource-schema-generator.factory';
import { ResourceExplorer } from '../explorer';
import { ResourceSchemaGeneratorInterface } from '../schema-generator/resource-schema-generator.interface';
import { RelationshipsSchemaGenerator } from '../schema-generator';
import { ResourceSchemaDictionary } from './resource-schema-dictionary';
import { ResourceRefSchemaGenerator } from '../schema-generator/resource-ref-schema-generator';

export class ResourceRefSchemaGeneratorFactory
implements ResourceSchemaGeneratorFactory {
  constructor(
    private readonly resourceSchemaDictionary: ResourceSchemaDictionary,
  ) {}

  create<T>(
    explorer: ResourceExplorer<T>,
    relationshipsSchemaGenerator: RelationshipsSchemaGenerator,
  ): ResourceSchemaGeneratorInterface {
    return new ResourceRefSchemaGenerator(
      explorer,
      relationshipsSchemaGenerator,
      this.resourceSchemaDictionary,
    );
  }
}
