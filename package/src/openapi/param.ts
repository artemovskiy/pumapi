import { OpenAPIV3 } from 'openapi-types';

export class Param {
  private _name: string;

  setName(name: string) {
    this._name = name;
    return this;
  }

  private _location: string;

  setLocation(location: string) {
    this._location = location;
    return this;
  }

  getOpenapi(): OpenAPIV3.ParameterObject {
    return {
      name: this._name,
      in: this._location,
    };
  }
}
