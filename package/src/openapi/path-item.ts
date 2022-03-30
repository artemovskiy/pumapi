import { OpenAPIV3 } from 'openapi-types';

import { Operation } from './operation';

type PathItemOperations = {
  [K in OpenAPIV3.HttpMethods]?: Operation;
};

export class PathItem {
  private _path: string;

  setPath(path: string) {
    this._path = path;
    return this;
  }

  getPath(): string {
    return this._path;
  }

  private _operations: PathItemOperations = {};

  addOperation(operation: Operation): this {
    this._operations[operation.getMethod()] = operation;
    return this;
  }

  getOpenapi(): OpenAPIV3.PathItemObject {
    const operations = {};
    for (const method in this._operations) {
      if (Object.prototype.hasOwnProperty.call(this._operations, method)) {
        operations[method] = this._operations[method].getOpenapi();
      }
    }
    return operations;
  }
}
