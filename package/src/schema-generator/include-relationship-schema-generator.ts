import {
  RelationshipsSchemaGenerator,
  ResourceRelationship,
} from './relationships-schema-generator.interface';
import { ArrayType, Constructor } from '../types';
import { ResourceIdentifierSchemaGenerator } from './resource-identifier-schema-generator';
import { IdentificationExplorer } from '../explorer';

export class IncludeRelationshipSchemaGenerator
  implements RelationshipsSchemaGenerator
{
  constructor(private readonly relatedTypesSet: Set<Constructor<any>>) {}

  generateSchema<T, R extends keyof T>(
    relationship: ResourceRelationship<T, R>,
  ): any {
    return {
      type: 'object',
      properties: {
        data: this.getDataSchema(relationship.rCtor),
      },
    };
  }

  private getDataSchema<T>(ctor: Constructor<T>) {
    if (ctor instanceof ArrayType) {
      this.relatedTypesSet.add(ctor.ctor);
      const identifierSchemaGenerator = new ResourceIdentifierSchemaGenerator(
        new IdentificationExplorer(ctor.ctor),
      );
      return {
        type: 'array',
        items: identifierSchemaGenerator.generateSchema(),
      };
    } else {
      this.relatedTypesSet.add(ctor);
      const identifierSchemaGenerator = new ResourceIdentifierSchemaGenerator(
        new IdentificationExplorer<T>(ctor),
      );
      return identifierSchemaGenerator.generateSchema();
    }
  }
}
