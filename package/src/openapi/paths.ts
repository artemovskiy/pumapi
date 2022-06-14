import { OpenAPIV3 } from 'openapi-types';
import { PathItem } from './path-item';

export class Paths {
  private pathItems: Map<string, PathItem> = new Map();

  setPathItem(pathItem: PathItem) {
    this.pathItems.set(pathItem.getPath(), pathItem);
  }

  getPathItem(path: string): PathItem {
    return this.pathItems.get(path);
  }

  listPaths() {
    return Array.from(this.pathItems.keys());
  }

  getOpenapi(): OpenAPIV3.PathsObject {
    const paths = {};
    this.pathItems.forEach((pathItem) => {
      paths[pathItem.getPath()] = pathItem.getOpenapi();
    });
    return paths;
  }
}
