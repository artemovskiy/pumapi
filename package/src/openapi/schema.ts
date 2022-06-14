export class Schema {
  protected _data: any;

  setData(data: any) {
    this._data = data;
    return this;
  }

  getJsonapi() {
    return this._data;
  }
}
