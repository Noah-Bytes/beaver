import {
  IDragOptions,
  IExtension,
  IWebsite,
  IWebsiteInstance,
  IWebsiteMeta,
} from '@beaver/types';
import { Website } from './website';

export class Extension implements IExtension {
  registerWebsite?: IWebsiteInstance;
  website?: IWebsite;
  options?: IDragOptions;

  constructor(options?: IDragOptions) {
    this.options = options;
    this.init();
  }

  init(): void {
    const Clazz = this.registerWebsite || Website;
    this.website = new Clazz(this.options);
  }

  override(website: IWebsiteInstance): void {
    this.registerWebsite = website;
    this.website = new website(this.options);
  }

  collectWebsite(): IWebsiteMeta {
    if (!this.website) {
      throw new Error('extension Uninitialized');
    }
    return this.website?.meta;
  }

  collectAll() {
    return {
      website: this.collectWebsite(),
      media: {
        image: [
          ...(this.website?.getImageMetas() || []),
          ...(this.website?.getBgImageMetas() || []),
        ],
        svg: this.website?.getSvgMetas() || [],
      },
    };
  }
}
