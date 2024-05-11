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

  async getBase64Meta(
    element: HTMLElement,
  ): Promise<IWebsiteImageMeta | undefined> {
    const meta = this.getMeta(element);

    if (meta?.base64) {
      return meta;
    }

    if (meta?.src) {
      const base64 = await toDataURL(this.getRealUrl(meta?.src), 5000);
      if (base64) {
        const ext = getBase64Ext(base64);
        return {
          ...meta,
          base64,
          ext,
        };
      }
    }

    console.error(element);
    throw new Error('error');
  }

  getMeta(element: HTMLElement): IWebsiteImageMeta | undefined {
    const title = this.getTitle(element);
    const origin = this.getOrigin(element);
    if (element instanceof HTMLImageElement) {
      let srcText = element.dataset['src'] || element.src;

      if (element.dataset['srcset'] || element.srcset) {
        const imageDescBySize = getImageDescBySize(
          element.dataset['srcset'] || element.srcset,
        );
        if (imageDescBySize.length > 0) {
          const [{ url }] = imageDescBySize;
          srcText = url;
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
          ext: getBase64Ext(srcText),
          type: 'image',
        };
      }

      return {
        title,
        origin,
        src: this.getRealUrl(srcText),
        type: 'image',
      };
    }

    if (element.parentElement && element.parentElement.tagName === 'PICTURE') {
      const source = getPictureMaxSource(element.parentElement);
      if (source.length > 0) {
        const [[{ url }]] = source;
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
