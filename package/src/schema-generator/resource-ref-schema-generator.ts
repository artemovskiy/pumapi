import { ResourceSchemaGeneratorInterface } from './resource-schema-generator.interface';
import { ResourceExplorer } from '../explorer';
import { RelationshipsSchemaGenerator } from './relationships-schema-generator.interface';
import { ResourceSchemaGenerator } from './resource-schema-generator';
import { ResourceSchemaDictionary } from '../scanner/resource-schema-dictionary';
import { Schema } from '../openapi';

export class ResourceRefSchemaGenerator<T>
  implements ResourceSchemaGeneratorInterface
{
  private readonly wrappedSchemaGenerator: ResourceSchemaGenerator<T>;

  constructor(
    protected readonly explorer: ResourceExplorer<T>,
    private readonly relationshipsSchemaGenerator: RelationshipsSchemaGenerator,
    private readonly dict: ResourceSchemaDictionary,
  ) {
    this.wrappedSchemaGenerator = new ResourceSchemaGenerator<T>(
      explorer,
      relationshipsSchemaGenerator,
    );
  }

  buildResourceSchema(): any {
    const realSchema = new Schema();
    realSchema.setData(this.wrappedSchemaGenerator.buildResourceSchema());
    this.dict.setResourceSchema(
      this.schemaName,
      realSchema,
      this.explorer.ctor.name,
    );
    return {
      $ref: '#/components/schemas/' + this.schemaName,
    };
  }

  private get schemaName() {
    return 'Included' + this.explorer.ctor.name;
  }
}
