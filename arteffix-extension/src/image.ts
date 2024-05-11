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
          title: element.getAttribute('alt') || undefined,
          src: getFullUrl(url),
        };
      }
    }

    if (
      isBase64(srcText, {
        allowMime: true,
      })
    ) {
      return {
        title: element.getAttribute('alt')  || undefined,
        base64: srcText,
      };
    }

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const source = getPictureMaxSource(element.parentElement);
      if (source.length > 0) {
        const [[{ width, url }]] = source;
        return {
          title: element.getAttribute('alt')  || undefined,
          src: getFullUrl(url),
        };
      }
    }

    return {
      title: element.getAttribute('alt') || undefined,
      src: srcText,
    };
  }
}
