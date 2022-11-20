export class Response<D extends {}, M extends {} = undefined> {
  constructor(
    public readonly document: D,
    public readonly meta: M,
  ) {
  }

  isList(): boolean {
    return Array.isArray(this.document);
  }
}
