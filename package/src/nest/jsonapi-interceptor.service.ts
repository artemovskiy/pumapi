import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as e from 'express';

import { DocumentSerializer } from '../serializer';
import {
  ResourceDeserializer,
  StubRelationshipsResolver,
} from '../deserializer';
import { OperationExplorer, ResourceExplorer } from '../explorer';
import { Constructor } from '../types';
import { JSONAPI_CONFIG_TOKEN, IConfig } from './types';

const WITH_BODY_METHODS = ['POST', 'PUT', 'PATCH'];

@Injectable()
export class JsonapiInterceptor implements NestInterceptor {
  constructor(@Inject(JSONAPI_CONFIG_TOKEN) private config: IConfig) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const handler = context.getHandler();
    const operationExplorer = new OperationExplorer(
      context.getClass(),
      handler.name,
      'unknown',
    );

    const exploredResponse = operationExplorer.exploreResponseResource();
    const documentSerializer = exploredResponse?.type
      ? new DocumentSerializer(exploredResponse.type, this.config.baseUrl)
      : null;

    const req = context.switchToHttp().getRequest<e.Request>();
    const bodyType = operationExplorer.exploreBodyType();
    if (WITH_BODY_METHODS.includes(req.method.toUpperCase()) && bodyType) {
      const { data } = req.body;
      const explorer = new ResourceExplorer(bodyType as Constructor<any>);

      const deserializer = new ResourceDeserializer(
        data,
        explorer,
        operationExplorer.exploreInputResourceOptions().cgi,
        new StubRelationshipsResolver(),
      );
      req.body = await deserializer.deserialize();
    }

    if (!documentSerializer) {
      return next.handle();
    }
    return next
      .handle()
      .pipe(map((resource) => documentSerializer.serialize(resource)));
  }
}
