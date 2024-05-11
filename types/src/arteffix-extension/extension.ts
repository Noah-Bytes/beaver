import {
  IWebsite,
  IWebsiteImageMeta,
  IWebsiteInstance,
  IWebsiteMeta,
  IWebsiteSVGMeta,
} from '@beaver/types';

export interface IMediaAll {
  image: IWebsiteImageMeta[];
  svg: IWebsiteSVGMeta[];
}

export interface IExtensionProps {
  onDragEnd?: () => void;
}

export interface IExtension {
  registerWebsite?: IWebsiteInstance;
  website?: IWebsite;

  override(website: IWebsiteInstance): void;

  init: () => void;

  collectWebsite: () => IWebsiteMeta;
  collectAll: () => {
    website: IWebsiteMeta;
    media: IMediaAll;
  };
}
