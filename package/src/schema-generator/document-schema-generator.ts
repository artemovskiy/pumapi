import { ArrayType, Constructor } from '../types';
import { ResourceSchemaGenerator } from './resource-schema-generator';
import { IncludeRelationshipSchemaGenerator } from './include-relationship-schema-generator';
import { LinksRelationshipSchemaGenerator } from './links-relationship-schema-generator';
import { ResourceExplorer } from '../explorer';
import { ResourceSchemaGeneratorFactory } from './resource-schema-generator.factory';

export class DocumentSchemaGenerator<T> {
  private readonly includedTypes: Set<Constructor<any>> = new Set();

  constructor(
    private readonly resourceCtor: Constructor<T>,
    private readonly includedResourcesSchemaGeneratorFactory: ResourceSchemaGeneratorFactory,
  ) {}

  generateSchema() {
    const result: any = {
      type: 'object',
      properties: {
        data: this.generateDataSchema(),
      },
    };
    if (this.includedTypes.size) {
      result.properties.included = this.generateIncludedObjectSchema();
    }
    return result;
  }

  private generateDataSchema() {
    if (this.resourceCtor instanceof ArrayType) {
      const resourceSchemaGenerator = new ResourceSchemaGenerator<T>(
        new ResourceExplorer<T>(this.resourceCtor.ctor),
        new IncludeRelationshipSchemaGenerator(this.includedTypes),
      );
      return {
        type: 'array',
        items: resourceSchemaGenerator.buildResourceSchema(),
      };
    }
    const resourceSchemaGenerator = new ResourceSchemaGenerator<T>(
      new ResourceExplorer<T>(this.resourceCtor),
      new IncludeRelationshipSchemaGenerator(this.includedTypes),
    );
    return resourceSchemaGenerator.buildResourceSchema();
  }

  private generateIncludedObjectSchema() {
    const includedTypesSchemas = [];
    const relationshipSchemaGenerator = new LinksRelationshipSchemaGenerator();
    this.includedTypes.forEach((ctor) => {
      const schemaGenerator = this.includedResourcesSchemaGeneratorFactory.create(
        new ResourceExplorer<T>(ctor),
        relationshipSchemaGenerator,
      );
      includedTypesSchemas.push(schemaGenerator.buildResourceSchema());
    });
    return {
      type: 'array',
      items: {
        anyOf: includedTypesSchemas,
      },
    };
  }
}
