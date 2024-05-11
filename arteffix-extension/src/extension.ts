import {
  IExtension,
  IWebsite,
  IWebsiteInstance,
  IWebsiteMeta,
} from '@beaver/types';
import { Website } from './website';

export class Extension implements IExtension {
  registerWebsite?: IWebsiteInstance;
  website?: IWebsite;

  constructor() {
    this.init();
  }

  init(): void {
    const Clazz = this.registerWebsite || Website;
    this.website = new Clazz();
  }

  override(website: IWebsiteInstance): void {
    this.registerWebsite = website;
    this.website = new website();
  }

  collectWebsite(): IWebsiteMeta {
    if (!this.website) {
      throw new Error('extension Uninitialized');
    }
    return this.website?.getMeta();
  }

  collectAll() {
    const imgs = this.website?.getImageMetas();
    const bgImgs = this.website?.getBgImageMetas();
    return {
      website: this.collectWebsite(),
      media: {
        image: [...(imgs || []), ...(bgImgs || [])],
        svg: this.website?.getSvgMetas() || [],
      },
    };
  }
}
