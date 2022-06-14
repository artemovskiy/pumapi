import { RelationshipsSchemaGenerator } from './relationships-schema-generator.interface';

export class LinksRelationshipSchemaGenerator
implements RelationshipsSchemaGenerator {
  generateSchema(): any {
    return {
      type: 'object',
      properties: {
        links: {
          type: 'object',
          properties: {
            related: {
              type: 'string',
            },
          },
        },
      },
    };
  }
}
