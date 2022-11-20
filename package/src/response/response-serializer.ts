import * as JSONAPI from 'jsonapi-typescript';
import { DocumentSerializer } from '../serializer';
import { Response } from './response';

export class ResponseSerializer<D extends {}, M extends {} = undefined> {
  constructor(
    private readonly serializer: DocumentSerializer<D>,
  ) {
  }

  serialize(response: Response<D, M>): JSONAPI.DocWithData {
    const serialized = this.serializer.serialize(response.document);
    return {
      data: serialized.data,
      included: serialized.included,
      meta: response.meta,
    };
  }
}
