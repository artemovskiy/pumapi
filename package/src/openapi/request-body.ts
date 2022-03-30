import { ContentEntity } from './content-entity';

export class RequestBody extends ContentEntity {
  private _isRequired: boolean;

  setRequired(isRequired: boolean) {
    this._isRequired = isRequired;
    return this;
  }

  getIsRequired(): boolean {
    return this._isRequired;
  }
}
