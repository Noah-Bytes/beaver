import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import isBase64 from 'is-base64';
import { Drag } from './drag';
import { getBase64Ext, getFullUrl, getSrcSet, toDataURL } from './utils';

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  override getMetaData(): IWebsiteImageMeta {
    const result: IWebsiteImageMeta = {
      title: this.getTitle(),
      origin: this.getOrigin(),
      type: 'image',
    };
    const src = this.getSrc();

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

  getOrigin(): string | undefined {
    return location.href;
  }

  getTitle(): string | undefined {
    return this.dragElement!.getAttribute('alt') || undefined;
  }

  getSrc(): string {
    const dom = this.dragElement as HTMLImageElement;
    return getSrcSet(dom) || dom.src;
  }

  getRealUrl(url: string): string {
    return getFullUrl(url);
  }

  async getBase64Meta(): Promise<IWebsiteImageMeta | undefined> {
    const meta = this.getMetaData();

    if (meta?.base64) {
      return meta;
    }

    if (meta?.src) {
      const base64 = await toDataURL(meta.src, 5000);
      if (base64) {
        const ext = getBase64Ext(base64);
        return {
          ...meta,
          base64,
          ext,
        };
      }
    }
    throw new Error('error');
  }
}
