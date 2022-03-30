import { IdentificationExplorer } from '../explorer';

export class ResourceIdentifierSchemaGenerator<T> {
  constructor(protected readonly explorer: IdentificationExplorer<T>) {}

  generateSchema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: [this.explorer.getType()],
        },
      },
    };
  }
}
