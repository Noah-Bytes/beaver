import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import isBase64 from 'is-base64';
import { Drag } from './drag';
import { getFullUrl, getImageDescBySize, getPictureMaxSource } from './utils';

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  getOrigin(element: HTMLElement): string | undefined {
    return element.getAttribute('alt') || undefined;
  }

  getMeta(element: HTMLElement): IWebsiteImageMeta | undefined {
    if (element instanceof HTMLImageElement) {
      const srcText = element.dataset['src'] || element.src;

      if (element.dataset['srcset'] || element.srcset) {
        const imageDescBySize = getImageDescBySize(
          element.dataset['srcset'] || element.srcset,
        );
        if (imageDescBySize.length > 0) {
          const [{ width, url }] = imageDescBySize;
          return {
            title: this.getOrigin(element),
            src: getFullUrl(url),
            type: 'image',
          };
        }
      }

      if (
        isBase64(srcText, {
          allowMime: true,
        })
      ) {
        return {
          title: this.getOrigin(element),
          base64: srcText,
          type: 'image',
        };
      }

      return {
        title: this.getOrigin(element),
        src: srcText,
        type: 'image',
      };
    }

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const source = getPictureMaxSource(element.parentElement);
      if (source.length > 0) {
        const [[{ width, url }]] = source;
        return {
          title: this.getOrigin(element),
          src: getFullUrl(url),
          type: 'image',
        };
      }
    }

    return undefined;
  }
}
