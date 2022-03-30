import { Response } from './response';

export class Responses {
  private _responses: { [index: number]: Response } = {};

  setResponse(response: Response) {
    this._responses[response.getStatus()] = response;
    return this;
  }

  getOpenapi() {
    const result = {};
    for (const key in this._responses) {
      if (Object.prototype.hasOwnProperty.call(this._responses, key)) {
        result[key] = this._responses[key].getOpenapi();
      }
    }
    return result;
  }
}
