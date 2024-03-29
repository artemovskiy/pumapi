import * as R from 'ramda';

import {
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';
import { ParamsMetadata } from '@nestjs/core/helpers/interfaces';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

import {
  ArrayType,
  Constructor,
  DocumentResponse,
  InputResourceOptions,
  ParameterDefinition,
} from '../types';
import { METADATA } from '../metadata';
import {
  assertOnlyOpeningExceptTrailingSlash,
  assertOnlyOpeningSlash,
} from './utils';

const getParamtype = R.compose<[string], string[], string, number>(Number, R.nth(0), R.split(':'));

export class OperationExplorer<
  N extends string | symbol,
  T extends { [K in N]: (...args: any[]) => any },
> {
  constructor(
    private readonly _class: Constructor<T>,
    private readonly methodName: N,
    private readonly parentPath: string,
  ) {}

  explorePath(): string {
    const ownPath = Reflect.getMetadata(PATH_METADATA, this.handler) || '';
    return (
      assertOnlyOpeningExceptTrailingSlash(this.parentPath)
      + assertOnlyOpeningSlash(ownPath)
    );
  }

  exploreMethod(): RequestMethod {
    return Reflect.getMetadata(METHOD_METADATA, this.handler);
  }

  exploreBodyType(): Constructor<any> | ArrayType<any> {
    const bodyParam: ParameterDefinition = this.exploreParams().find(
      R.propEq('location', RouteParamtypes.BODY),
    );
    return bodyParam ? bodyParam.type : null;
  }

  private exploreCustomBodyType(): Constructor<any> | ArrayType<any> {
    const inputResourceOptions = this.exploreInputResourceOptions();
    return inputResourceOptions.type;
  }

  exploreParams(): ParameterDefinition[] {
    const paramTypes: Constructor<unknown>[] = this.getParamTypes();
    const routeArgsMetadata: ParamsMetadata = this.getRouteArgsMetadata();
    const params: ParameterDefinition[] = [];
    for (const key in routeArgsMetadata) {
      if (Object.prototype.hasOwnProperty.call(routeArgsMetadata, key)) {
        const value = routeArgsMetadata[key];
        const type = getParamtype(key) === RouteParamtypes.BODY && this.exploreCustomBodyType()
          ? this.exploreCustomBodyType()
          : paramTypes[value.index];
        params.push({
          name: String(value.data),
          location: getParamtype(key) as RouteParamtypes,
          type,
        });
      }
    }
    return params;
  }

  private getParamTypes() {
    return Reflect.getMetadata(
      PARAMTYPES_METADATA,
      this._class.prototype,
      this.methodName,
    );
  }

  private getRouteArgsMetadata() {
    return (
      Reflect.getMetadata(ROUTE_ARGS_METADATA, this._class, this.methodName)
      || {}
    );
  }

  exploreInputResourceOptions(): InputResourceOptions {
    const metadata: Partial<InputResourceOptions> = Reflect.getMetadata(
      METADATA.OPERATION.INPUT_RESOURCE,
      this.getMethodFn(),
    ) || {};
    return {
      ...metadata,
      cgi: metadata.cgi || 'allow',
    };
  }

  exploreSummary(): string | null {
    return Reflect.getMetadata(
      METADATA.OPERATION.SUMMARY,
      this.getMethodFn(),
    ) ?? null;
  }

  private getMethodFn() {
    return this._class.prototype[this.methodName];
  }

  exploreDescription(): string | null {
    return Reflect.getMetadata(
      METADATA.OPERATION.DESCRIPTION,
      this.getMethodFn(),
    ) ?? null;
  }

  exploreTags(): string[] | undefined {
    return Reflect.getMetadata(
      METADATA.OPERATION.TAGS,
      this.getMethodFn(),
    );
  }

  exploreResponseResource(): DocumentResponse<T> {
    return Reflect.getMetadata(
      METADATA.OPERATION.RESPONSE_RESOURCE,
      this.handler,
    );
  }

  exploreResponseMetadata(): Constructor<unknown> {
    return Reflect.getMetadata(
      METADATA.OPERATION.RESPONSE_MEATADATA,
      this.handler,
    );
  }

  private get handler(): T[N] {
    return this.getMethodFn();
  }
}
