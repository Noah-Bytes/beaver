import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import isBase64 from 'is-base64';
import { Drag } from './drag';
import { getFullUrl, getImageDescBySize, getPictureMaxSource } from './utils';

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  getOrigin(targetElement: HTMLElement): string | undefined {
    if (targetElement instanceof HTMLLinkElement) {
      return targetElement.href;
    }
    return location.href;
  }

  getTitle(element: HTMLElement): string | undefined {
    return element.getAttribute('alt') || undefined;
  }

  getRealUrl(url: string): string {
    return getFullUrl(url);
  }

  getMeta(element: HTMLElement): IWebsiteImageMeta | undefined {
    const title = this.getTitle(element);
    const origin = this.getOrigin(element);
    if (element instanceof HTMLImageElement) {
      const srcText = element.dataset['src'] || element.src;

      if (element.dataset['srcset'] || element.srcset) {
        const imageDescBySize = getImageDescBySize(
          element.dataset['srcset'] || element.srcset,
        );
        if (imageDescBySize.length > 0) {
          const [{ width, url }] = imageDescBySize;
          return {
            title,
            origin,
            src: this.getRealUrl(url),
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
          title,
          origin,
          base64: srcText,
          type: 'image',
        };
      }

      return {
        title,
        origin,
        src: srcText,
        type: 'image',
      };
    }

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const source = getPictureMaxSource(element.parentElement);
      if (source.length > 0) {
        const [[{ width, url }]] = source;
        return {
          title,
          origin,
          src: this.getRealUrl(url),
          type: 'image',
        };
      }
    }

    return undefined;
  }
}
