import { MediaType } from './media-type';

export abstract class ContentEntity {
  private _content: { [i: string]: MediaType } = {};

  setMediaType(mediaType: MediaType) {
    this._content[mediaType.getType()] = mediaType;
  }

  getOpenapi() {
    const content = {};
    for (const key in this._content) {
      if (Object.prototype.hasOwnProperty.call(this._content, key)) {
        content[key] = this._content[key].getOpenapi();
      }
    }
    return { content };
  }
}
