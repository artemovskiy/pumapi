import { ContentEntity } from './content-entity';

export class Response extends ContentEntity {
  private _status: number;

  setStatus(status: number) {
    this._status = status;
    return this;
  }

  getStatus(): number {
    return this._status;
  }
}
