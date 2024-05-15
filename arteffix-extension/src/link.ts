import {
  IDragOptions,
  IWebsiteImageMeta,
  IWebsiteLink,
  IWebsiteSVGMeta,
} from '@beaver/types';
import isBase64 from 'is-base64';
import { Drag } from './drag';
import { getBase64Ext, getFullUrl, getImageDescBySize } from './utils';

export class Link extends Drag implements IWebsiteLink {
  constructor(options?: IDragOptions) {
    super('a', options);
  }

  override getMetaData(): IWebsiteImageMeta | IWebsiteSVGMeta {
    const src = this.getSrc();
    const origin = this.getRealUrl(this.getOrigin());

    if (src) {
      const result: IWebsiteImageMeta = {
        title: this.getTitle(),
        origin,
        type: 'image',
      };
      if (
        isBase64(src, {
          allowMime: true,
        })
      ) {
        result.base64 = src;
        result.ext = getBase64Ext(src);
      } else {
        result.src = this.getRealUrl(src);
      }

      return result;
    }

    return {
      title: this.getTitle(),
      origin,
      type: 'svg',
      svg: this.dragElement!.querySelector('svg')!.outerHTML,
    };
  }

  getOrigin(): string {
    return this.dragElement?.getAttribute('href') || location.href;
  }

  getTitle(): string | undefined {
    return this.dragElement!.getAttribute('alt') || undefined;
  }

  getSrc(): string | undefined {
    let dom = this.dragElement!.querySelector('img')!;

    if (dom instanceof HTMLImageElement) {
      let srcText = dom.dataset['src'] || dom.src;

      if (dom.dataset['srcset'] || dom.srcset) {
        const imageDescBySize = getImageDescBySize(
          dom.dataset['srcset'] || dom.srcset,
        );
        if (imageDescBySize.length > 0) {
          const [{ url }] = imageDescBySize;
          srcText = url;
        }
      }

      return srcText;
    }

    return undefined;
  }

  getRealUrl(url: string): string {
    return getFullUrl(url);
  }

  override isTarget(): boolean {
    let target = this.dragElement!.querySelector('img, svg');
    return !!target;
  }
}
