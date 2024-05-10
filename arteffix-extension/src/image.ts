import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import isBase64 from 'is-base64';
import { Drag } from './drag';
import {
  getBase64ImageFormat,
  getFullUrl,
  getImageDescBySize,
  getPictureMaxSource,
  getUrlExtension,
} from './utils';

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  static getWidth(element: HTMLImageElement): number {
    return element.naturalWidth || element.width;
  }

  static getHeight(element: HTMLImageElement) {
    return element.naturalHeight || element.height;
  }

  static getMeta(element: HTMLImageElement): IWebsiteImageMeta {
    const srcText = element.dataset['src'] || element.src;

    const ext = getUrlExtension(srcText);

    if (element.dataset['srcset'] || element.srcset) {
      const imageDescBySize = getImageDescBySize(
        element.dataset['srcset'] || element.srcset,
      );
      if (imageDescBySize.length > 0) {
        const [{ width, url }] = imageDescBySize;
        return {
          width: width,
          height: Math.ceil(
            (this.getHeight(element) / this.getWidth(element)) * width,
          ),
          title: element.getAttribute('alt'),
          src: getFullUrl(url),
          ext,
        };
      }
    }

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

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const source = getPictureMaxSource(element.parentElement);
      if (source.length > 0) {
        const [[{ width, url }]] = source;
        return {
          width: width,
          height: Math.ceil(
            (this.getHeight(element) / this.getWidth(element)) * width,
          ),
          title: element.getAttribute('alt'),
          src: getFullUrl(url),
          ext,
        };
      }
    }

    return {
      width: element.naturalWidth || element.width,
      height: element.naturalHeight || element.height,
      title: element.getAttribute('alt'),
      src: srcText,
      ext,
    };
  }
}
