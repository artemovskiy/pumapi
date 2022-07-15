import { Constructor } from '../types';
import { METADATA } from '../metadata';

export class IdentificationExplorer<T> {
  constructor(public readonly ctor: Constructor<T>) {
    if (!(typeof ctor === 'function')) {
      throw new TypeError(`Invalid constructor type: ${typeof ctor}. Expected function`);
    }
    if (!(typeof ctor.prototype === 'object')) {
      throw new TypeError('Invalid constructor: expected ctor.prototype to be an object');
    }
  }

  getIdKey(): string {
    const idKey = Reflect.getMetadata(METADATA.RESOURCE.ID_KEY, this.ctor);
    if (
      (typeof idKey !== 'undefined' && typeof idKey !== 'string')
      || (typeof idKey === 'string' && !idKey.length)
    ) {
      throw new TypeError();
    }
    return idKey || 'id';
  }

  getType(): string {
    const type = Reflect.getMetadata(METADATA.RESOURCE.TYPE, this.ctor);
    if (
      (typeof type !== 'string' && typeof type !== 'undefined')
      || (typeof type === 'string' && !type.length)
    ) {
      throw new TypeError();
    }
    return type || this.ctor.name;
  }

  getId(object: T): string | number {
    return object[this.getIdKey()];
  }
}
