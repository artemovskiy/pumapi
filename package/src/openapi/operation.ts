import { OpenAPIV3 } from 'openapi-types';
import { Param } from './param';
import { Responses } from './responses';
import { RequestBody } from './request-body';

export class Operation {
  private _path: string;

  setPath(path: string) {
    this._path = path;
    return this;
  }

  getPath(): string {
    return this._path;
  }

  setMethod(method: OpenAPIV3.HttpMethods) {
    this._method = method;
    return this;
  }

  private _method: OpenAPIV3.HttpMethods;

  getMethod(): OpenAPIV3.HttpMethods {
    return this._method;
  }

  private _params: Param[] = [];

  addParam(param: Param) {
    this._params.push(param);
    return this;
  }

  private _responses: Responses;

  setResponses(responses: Responses) {
    this._responses = responses;
    return this;
  }

  private _requestBody: RequestBody;

  setRequestBody(requestBody: RequestBody) {
    this._requestBody = requestBody;
    return this;
  }

  private _description: string;

  setDescription(description: string) {
    this._description = description;
    return this;
  }

  private _summary: string;

  setSummary(summary: string) {
    this._summary = summary;
    return this;
  }

  getOpenapi(): OpenAPIV3.OperationObject {
    const result: OpenAPIV3.OperationObject = {
      parameters: this._params.map((param) => param.getOpenapi()),
      responses: this._responses.getOpenapi(),
    };
    if (this._requestBody) {
      result.requestBody = this._requestBody.getOpenapi();
    }
    if(this._description) {
      result.description = this._description;
    }
    if(this._summary) {
      result.summary = this._summary;
    }
    return result;
  }
}
