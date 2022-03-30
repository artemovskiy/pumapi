import * as R from 'ramda';
import { INestApplication } from '@nestjs/common';
import { NestContainer } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';

import { Paths, Document } from '../openapi';
import { ControllerScanner } from './controller-scanner';
import { ResourceSchemaDictionary } from './resource-schema-dictionary';
import { Components } from '../openapi/components';

const mergePaths = (paths: Paths[]): Paths => {
  const result = new Paths();
  for (const pathsObject of paths) {
    for (const pathStr of pathsObject.listPaths()) {
      const pathItem = pathsObject.getPathItem(pathStr);
      result.setPathItem(pathItem);
    }
  }
  return result;
};

export class AppScanner {
  private readonly document: Document;
  private readonly resourceSchemaDictionary: ResourceSchemaDictionary;
  constructor(private readonly app: INestApplication) {
    this.document = new Document();
    this.resourceSchemaDictionary = new ResourceSchemaDictionary();
  }

  scan() {
    const paths = mergePaths(
      R.flatten(
        this.getModules().map((module) => {
          return Array.from(module.routes.values()).map((value) => {
            const controllerScanner = new ControllerScanner(
              value,
              this.resourceSchemaDictionary,
            );
            return controllerScanner.scanner();
          });
        }),
      ),
    );
    this.document.setPaths(paths);
    const components = new Components();
    components.setSchemas(this.resourceSchemaDictionary.getSchemas());
    this.document.setComponents(components);
    return this.document;
  }

  private getModules(): Module[] {
    const container: NestContainer = (this.app as any).container;
    return Array.from(container.getModules().values());
  }
}
