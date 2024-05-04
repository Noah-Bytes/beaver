import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import * as isBase64 from 'is-base64';
import { Drag } from './drag';
import {
  getBase64ImageFormat,
  getPictureMaxSource,
  getUrlExtension,
} from './utils';

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  static getMeta(element: HTMLImageElement): IWebsiteImageMeta {
    const srcText = element.src;

    if (
      isBase64(srcText, {
        allowMime: true,
      })
    ) {
      return {
        width: element.naturalWidth,
        height: element.naturalHeight,
        title: element.getAttribute('alt'),
        base64: srcText,
        ext: getBase64ImageFormat(srcText),
      };
    }

    const sort = {
      'image/gif': 1,
      'image/png': 2,
      'image/jpeg': 3,
      'image/jpg': 3,
      '': 4,
      undefined: 4,
    };

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const [[{ width, url }]] = getPictureMaxSource(element.parentElement);
      return {
        width: width,
        height: (element.naturalHeight / element.naturalWidth) * width,
        title: element.getAttribute('alt'),
        src: url,
        ext: getUrlExtension(srcText),
      };
    }

    return {
      width: element.naturalWidth,
      height: element.naturalHeight,
      title: element.getAttribute('alt'),
      src: srcText,
      ext: getUrlExtension(srcText),
    };
  }
}
