import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import isBase64 from 'is-base64';
import { Drag } from './drag';
import {
  getBase64Ext,
  getFullUrl,
  getImageDescBySize,
  getPictureMaxSource,
  toDataURL,
} from './utils';

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

  async getMeta(element: HTMLElement): Promise<IWebsiteImageMeta | undefined> {
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

          const base64 = await toDataURL(this.getRealUrl(url), 5000);
          if (base64) {
            const ext = getBase64Ext(base64);
            return {
              title,
              origin,
              base64,
              ext,
              type: 'image',
            };
          }

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
        const ext = getBase64Ext(srcText);

        return {
          title,
          origin,
          base64: srcText,
          ext,
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
        const [[{ url }]] = source;

        const base64 = await toDataURL(this.getRealUrl(url), 5000);
        if (base64) {
          const ext = getBase64Ext(base64);
          return {
            title,
            origin,
            base64,
            ext,
            type: 'image',
          };
        }

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
