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
      assertOnlyOpeningExceptTrailingSlash(this.parentPath) +
      assertOnlyOpeningSlash(ownPath)
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

  exploreParams(): ParameterDefinition[] {
    const paramTypes: Constructor<unknown>[] = this.getParamTypes();
    const routeArgsMetadata: ParamsMetadata = this.getRouteArgsMetadata();
    const params: ParameterDefinition[] = [];
    for (const key in routeArgsMetadata) {
      if (routeArgsMetadata.hasOwnProperty(key)) {
        const value = routeArgsMetadata[key];
        const type = paramTypes[value.index];
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
      Reflect.getMetadata(ROUTE_ARGS_METADATA, this._class, this.methodName) ||
      {}
    );
  }

  exploreInputResourceOptions(): InputResourceOptions {
    const metadata: Partial<InputResourceOptions> =
      Reflect.getMetadata(
        METADATA.OPERATION.INPUT_RESOURCE,
        this._class.prototype[this.methodName],
      ) || {};
    return {
      cgi: metadata.cgi || 'allow',
    };
  }

  exploreSummary() {
    return  Reflect.getMetadata(
      METADATA.OPERATION.SUMMARY,
      this._class.prototype[this.methodName],
    ) ?? null
  }

  exploreDescription() {
    return  Reflect.getMetadata(
      METADATA.OPERATION.DESCRIPTION,
      this._class.prototype[this.methodName],
    ) ?? null
  }

  /* --- Responses --- */

  exploreResponseResource(): DocumentResponse<T> {
    return Reflect.getMetadata(
      METADATA.OPERATION.RESPONSE_RESOURCE,
      this.handler,
    );
  }

  private get handler(): T[N] {
    return this._class.prototype[this.methodName];
  }
}
