import {
  ClassType, MetadataStorage, TypeExplorer, TypeKind,
} from 'typereader';
import { Constructor } from '../types';

export class MetadataSchemaGenerator {
  protected schema: any;

  private typeExplorer: TypeExplorer;

  constructor(
    protected readonly ctor: Constructor<unknown>,
  ) {
    this.typeExplorer = new TypeExplorer(MetadataStorage.instance());
  }

  build() {
    const metaType = this.getMetadataType();

    const properties = metaType.getProperties().reduce((acc, item) => {
      const literalProperty = item.type.as(TypeKind.LiteralType);
      return {
        ...acc,
        [item.name]: this.generateAttributeSchema(literalProperty.getConstructorReference()),
      };
    }, {});

    this.schema = {
      type: 'object',
      properties,
    };
    return this.schema;
  }

  protected generateAttributeSchema(type: Constructor<unknown>) {
    if ((type as unknown as StringConstructor) === String) {
      return { type: 'string' };
    }
    if ((type as unknown as NumberConstructor) === Number) {
      return { type: 'number' };
    }
    if ((type as unknown as BooleanConstructor) === Boolean) {
      return { type: 'boolean' };
    }
    return { type: 'object' };
  }

  private getMetadataType(): ClassType {
    return this.typeExplorer.getType(this.ctor).as(TypeKind.Class);
  }
}
