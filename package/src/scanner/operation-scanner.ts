import { OpenAPIV3 } from 'openapi-types';

import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

import { ArrayType, Constructor } from '../types';
import {
  MediaType,
  Operation,
  Param,
  RequestBody,
  Response,
  Responses,
  Schema,
} from '../openapi';
import {
  DocumentSchemaGenerator,
  IncludeRelationshipSchemaGenerator,
  ResourceDraftSchemaGenerator,
  ResourcePatchSchemaGenerator,
} from '../schema-generator';
import { OperationExplorer, ResourceExplorer } from '../explorer';
import HttpMethods = OpenAPIV3.HttpMethods;
import { ResourceSchemaDictionary } from './resource-schema-dictionary';
import { RefSchema } from '../openapi/ref-schema';
import { ResourceRefSchemaGeneratorFactory } from './resource-ref-schema-generator-factory';
import { MetadataSchemaGenerator } from '../schema-generator/metadata-schema-generator';

const PARAM_TOKEN_PLACEHOLDER = 'placeholder';

export class OperationScanner<
  N extends string | symbol,
  T extends { [K in N]: (...args: any[]) => any },
> {
  private readonly operation: Operation;

  private readonly operationExplorer: OperationExplorer<N, T>;

  constructor(
    _class: Constructor<T>,
    methodName: N,
    parentPath: string,
    private readonly resourceSchemaDictionary: ResourceSchemaDictionary,
  ) {
    this.operation = new Operation();
    this.operationExplorer = new OperationExplorer(
      _class,
      methodName,
      parentPath,
    );
  }

  scan(): Operation {
    try {
      this.scanMethod();
    } catch (e) {
      return null;
    }
    this.scanPath();
    this.scanParams();
    this.scanResponses();
    this.scanSummary();
    this.scanDescription();
    this.scanTags();
    return this.operation;
  }

  private scanPath() {
    const jsonSchemaPath = this.operationExplorer.explorePath().replace(/\/:([a-zA-Z0-9\-_]+)/g, '/{$1}');
    this.operation.setPath(jsonSchemaPath);
  }

  private scanMethod() {
    this.operation.setMethod(
      OperationScanner.mapHttpMethod(this.operationExplorer.exploreMethod()),
    );
  }

  private scanParams() {
    this.operationExplorer
      .exploreParams()
      .forEach(({ location, type, name }) => {
        if (location === RouteParamtypes.BODY) {
          this.setRequestBody(type);
          return;
        }
        const openapiLocation = OperationScanner.mapParamLocation(location);
        if (openapiLocation === PARAM_TOKEN_PLACEHOLDER) {
          return;
        }
        const param = new Param();
        param.setLocation(openapiLocation);
        param.setName(name);
        this.operation.addParam(param);
      });
  }

  private setRequestBody(type: Constructor<any> | ArrayType<any>) {
    const schema = new Schema();
    const resourceSchema = this.getRequestBodySchemaGenerator(type)
      .buildResourceSchema();
    const dataSchema = type instanceof ArrayType
      ? { type: 'array', items: resourceSchema }
      : resourceSchema;
    schema.setData({
      type: 'object',
      properties: {
        data: dataSchema,
      },
      required: ['data'],
    });
    const schemaName = `${type.name}RequestBody`;
    const schemaId = this.resourceSchemaDictionary.setResourceSchema(schemaName, schema, type);
    const refSchema = new RefSchema();
    refSchema.setRef(`#/components/schemas/${schemaId}`);
    const jsonapiMediaType = new MediaType();
    jsonapiMediaType.setType('application/vnd.api+json');
    jsonapiMediaType.setSchema(refSchema);
    const requestBody = new RequestBody();
    requestBody.setRequired(true);
    requestBody.setMediaType(jsonapiMediaType);
    this.operation.setRequestBody(requestBody);
  }

  private scanSummary() {
    this.operation.setSummary(this.operationExplorer.exploreSummary());
  }

  private scanDescription() {
    this.operation.setDescription(this.operationExplorer.exploreDescription());
  }

  private scanTags() {
    this.operation.setTags(this.operationExplorer.exploreTags());
  }

  private getRequestBodySchemaGenerator(
    type: Constructor<any> | ArrayType<any>,
  ) {
    const ctor: Constructor<any> = type instanceof ArrayType ? type.ctor : type;
    const resourceExplorer = new ResourceExplorer(ctor);
    switch (this.operationExplorer.exploreMethod()) {
      case RequestMethod.PUT:
      case RequestMethod.POST: {
        const options = this.operationExplorer.exploreInputResourceOptions();
        return new ResourceDraftSchemaGenerator(
          resourceExplorer,
          new IncludeRelationshipSchemaGenerator(new Set<Constructor<any>>()),
          options.cgi,
        );
      }
      case RequestMethod.PATCH: {
        return new ResourcePatchSchemaGenerator(
          resourceExplorer,
          new IncludeRelationshipSchemaGenerator(new Set<Constructor<any>>()),
        );
      }
      default:
        return null;
    }
  }

  private scanResponses() {
    const responses = new Responses();
    const definition = this.operationExplorer.exploreResponseResource();
    if (definition) {
      const schemaGenerator = new DocumentSchemaGenerator(
        definition.type as Constructor<T>,
        new ResourceRefSchemaGeneratorFactory(this.resourceSchemaDictionary),
      );
      const documentSchema = new Schema();
      const responseObjectSchema = schemaGenerator.generateSchema();
      this.addMetaIfSet(responseObjectSchema);
      documentSchema.setData(responseObjectSchema);
      const schemaName = `${definition.type.name}Response`;
      const schemaId = this.resourceSchemaDictionary.setResourceSchema(
        schemaName,
        documentSchema,
        definition.type,
      );
      const refSchema = new RefSchema();
      refSchema.setRef(`#/components/schemas/${schemaId}`);
      const jsonapiMediaType = new MediaType();
      jsonapiMediaType.setType('application/vnd.api+json');
      jsonapiMediaType.setSchema(refSchema);
      const documentResponse = new Response();
      documentResponse.setStatus(200);
      documentResponse.setMediaType(jsonapiMediaType);
      responses.setResponse(documentResponse);
    }
    this.operation.setResponses(responses);
  }

  private addMetaIfSet(schema: any) {
    const metaCtor = this.operationExplorer.exploreResponseMetadata();
    if (!metaCtor) {
      return;
    }
    const metaSchema = (new MetadataSchemaGenerator(metaCtor)).build();
    // eslint-disable-next-line no-param-reassign
    schema.properties.meta = metaSchema;
  }

  private static mapParamLocation(paramType: RouteParamtypes): string {
    switch (paramType) {
      case RouteParamtypes.BODY:
        return 'body';
      case RouteParamtypes.PARAM:
        return 'path';
      case RouteParamtypes.QUERY:
        return 'query';
      case RouteParamtypes.HEADERS:
        return 'header';
      default:
        return PARAM_TOKEN_PLACEHOLDER;
    }
  }

  // TODO: map every available method
  private static readonly HTTP_METHODS_MAPPING: {
    [P in RequestMethod]?: OpenAPIV3.HttpMethods;
  } = {
    [RequestMethod.GET]: HttpMethods.GET,
    [RequestMethod.POST]: HttpMethods.POST,
    [RequestMethod.PUT]: HttpMethods.PUT,
    [RequestMethod.PATCH]: HttpMethods.PATCH,
    [RequestMethod.DELETE]: HttpMethods.DELETE,
  };

  private static mapHttpMethod(
    nestMethod: RequestMethod,
  ): OpenAPIV3.HttpMethods {
    const httpMethod = OperationScanner.HTTP_METHODS_MAPPING[nestMethod];
    if (typeof httpMethod === 'undefined') {
      throw new TypeError('unknown method');
    }
    return httpMethod;
  }
}
