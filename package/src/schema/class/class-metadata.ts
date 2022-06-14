import { AnyInstance, PropertyParams } from './types';

export class ClassMetadata<T extends AnyInstance> {
  private static readonly CLASS_PROPERTIES = 'jsonapi/object/properties';

  constructor(
    private readonly prototype: unknown,
  ) {
  }

  setProperty<K extends keyof T>(name: K, params: PropertyParams<T[K]>) {
    const properties = Reflect.getMetadata(ClassMetadata.CLASS_PROPERTIES, this.prototype) || {};
    Reflect.defineMetadata(
      ClassMetadata.CLASS_PROPERTIES,
      {
        ...properties,
        [name]: params,
      },
      this.prototype,
    );
  }

  getProperties(): { [P in keyof T]: PropertyParams<T[P]> } {
    const obtainedMetadata = Reflect.getMetadata(ClassMetadata.CLASS_PROPERTIES, this.prototype);
    return obtainedMetadata ?? {};
  }
}
