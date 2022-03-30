import { ResourceExplorer } from '../explorer';
import { RelationshipsSchemaGenerator } from './relationships-schema-generator.interface';
import { ResourceSchemaGeneratorInterface } from './resource-schema-generator.interface';

export interface ResourceSchemaGeneratorFactory {
  create<T>(
    explorer: ResourceExplorer<T>,
    relationshipsSchemaGenerator: RelationshipsSchemaGenerator,
  ): ResourceSchemaGeneratorInterface;
}
