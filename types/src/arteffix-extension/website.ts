import { IDragOptions } from './drag';
import { IWebsiteImage, IWebsiteImageMeta } from './image';
import { IWebsiteLink } from './link';
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
  image?: IWebsiteImage;
  svg?: IWebsiteSvg;
  link?: IWebsiteLink;
  readonly meta: IWebsiteMeta;
  options?: IDragOptions;

  init: () => void;
  initImage: () => void;
  initSvg: () => void;
  initLink: () => void;

  getBgImageMetas: () => IWebsiteImageMeta[];
  getImageMetas: () => IWebsiteImageMeta[];

  getSvgMetas: () => IWebsiteSVGMeta[];
}

export type IWebsiteInstance = new (options?: IDragOptions) => IWebsite;
