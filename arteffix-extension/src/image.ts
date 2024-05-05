import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import * as isBase64 from 'is-base64';
import { Drag } from './drag';
import {
  getBase64ImageFormat,
  getImageDescBySize,
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

    const ext = getUrlExtension(srcText);

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const source = getPictureMaxSource(element.parentElement);
      if (source.length > 0) {
        const [[{ width, url }]] = source;
        return {
          width: width,
          height: Math.ceil(
            (element.naturalHeight / element.naturalWidth) * width,
          ),
          title: element.getAttribute('alt'),
          src: url,
          ext,
        };
      }
    }

    if (element.dataset['srcset'] || element.srcset) {
      const imageDescBySize = getImageDescBySize(
        element.dataset['srcset'] || element.srcset,
      );
      if (imageDescBySize.length > 0) {
        const [{ width, url }] = imageDescBySize;
        return {
          width: width,
          height: Math.ceil(
            (element.naturalHeight / element.naturalWidth) * width,
          ),
          title: element.getAttribute('alt'),
          src: url,
          ext,
        };
      }
    }

    return {
      width: element.naturalWidth,
      height: element.naturalHeight,
      title: element.getAttribute('alt'),
      src: srcText,
      ext,
    };
  }
}
