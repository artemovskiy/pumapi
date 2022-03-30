import { Paths } from './paths';
import { Components } from './components';

export class Document {
  private paths: Paths;
  private _components: Components;

  setPaths(paths: Paths): this {
    this.paths = paths;
    return this;
  }

  setComponents(components: Components) {
    this._components = components;
    return this;
  }

  toJSON() {
    const newVar = {
      openapi: '3.0.0',
      paths: this.paths.getOpenapi(),
      components: this._components.getOpenapi(),
    };
    return newVar;
  }
}
