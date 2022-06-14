import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Controller } from '@nestjs/common/interfaces';

import { ControllerExplorer } from '../explorer';
import { Paths, PathItem } from '../openapi';
import { OperationScanner } from './operation-scanner';
import { ResourceSchemaDictionary } from './resource-schema-dictionary';

export class ControllerScanner {
  private readonly explorer: ControllerExplorer;

  private readonly paths: Paths;

  constructor(
    private readonly controller: InstanceWrapper<Controller>,
    private readonly resourceSchemaDictionary: ResourceSchemaDictionary,
  ) {
    this.paths = new Paths();
    this.explorer = new ControllerExplorer(controller);
  }

  scanner() {
    const commonPath = this.explorer.explorePath();
    const prototype = Object.getPrototypeOf(this.controller.instance);
    this.explorer.exploreMethods().forEach((methodName) => {
      const scanner = new OperationScanner(
        prototype.constructor,
        methodName,
        commonPath,
        this.resourceSchemaDictionary,
      );
      const operation = scanner.scan();
      if (!operation) {
        return;
      }
      const pathItem = this.paths.getPathItem(operation.getPath())
        || new PathItem().setPath(operation.getPath());
      pathItem.addOperation(operation);
      this.paths.setPathItem(pathItem);
    });
    return this.paths;
  }
}
