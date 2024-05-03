import { IWebsiteLink } from './link';
import { IDragOptions } from './drag';
import { IWebsiteImage, IWebsiteImageMeta } from './image';
import { IWebsiteSVGMeta, IWebsiteSvg } from './svg';

export interface IWebsiteMeta {
  title: string;
  description: string;
  keywords: string;
  url: string;
  favicon: string;
  picture?: string;
  screenshot?: string;
}

export type IWebsiteSelectorMeta = Omit<
  IWebsiteMeta,
  'url' | 'screenshot' | 'title'
>;

export interface IWebsite {
  readonly metaSelector: IWebsiteSelectorMeta;
  readonly image: IWebsiteImage;
  readonly svg: IWebsiteSvg;
  readonly link: IWebsiteLink;
  readonly meta: IWebsiteMeta;

  getBgImageMetas: () => IWebsiteImageMeta[];
  getImageMetas: () => IWebsiteImageMeta[];

  getSvgMetas: () => IWebsiteSVGMeta[];
}

export type IWebsiteInstance = new (options?: IDragOptions) => IWebsite;
