import { IDrag } from './drag';

export interface IWebsiteImageMeta {
  type: string;
  src?: string;
  ext?: string;
  title?: string;
  origin?: string;
  base64?: string;
}

export interface IWebsiteImage extends IDrag {
  getOrigin: (targetElement: HTMLElement) => string | undefined;
  getTitle: (element: HTMLElement) => string | undefined;
  getMeta: (element: HTMLElement) => Promise<IWebsiteImageMeta | undefined>;
  getRealUrl: (url: string) => string;
}
