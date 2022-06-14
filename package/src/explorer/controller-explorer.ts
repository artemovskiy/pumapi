import * as R from 'ramda';

import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Controller } from '@nestjs/common/interfaces';
import { PATH_METADATA } from '@nestjs/common/constants';
import { MetadataScanner } from '@nestjs/core';

export class ControllerExplorer {
  private readonly metadataScanner = new MetadataScanner();

  constructor(private readonly controller: InstanceWrapper<Controller>) {}

  exploreMethods() {
    const prototype = Object.getPrototypeOf(this.controller.instance);
    return this.metadataScanner.scanFromPrototype(
      this.controller.instance,
      prototype,
      R.identity,
    );
  }

  explorePath(): string {
    return Reflect.getMetadata(PATH_METADATA, this.controller.metatype);
  }
}
