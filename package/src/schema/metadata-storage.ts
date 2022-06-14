import { ClassMetadata } from './class/class-metadata';

export class MetadataStorage {
  private static _instance: MetadataStorage;

  public static instance() {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance;
  }

  getClassMetadata<T>(prototype: unknown) {
    return new ClassMetadata<T>(prototype);
  }
}
