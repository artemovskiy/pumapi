import { AnyInstance, PropertyParams } from './types';
import { MetadataStorage } from '../metadata-storage';

export function Property(
  options?: Partial<PropertyParams<unknown>>,
): PropertyDecorator {
  const optionsSafe = options || {};
  return (target: unknown, propertyKey: string | symbol) => {
    MetadataStorage
      .instance()
      .getClassMetadata<AnyInstance>(target)
      .setProperty(propertyKey, optionsSafe as PropertyParams<unknown>);
  };
}
