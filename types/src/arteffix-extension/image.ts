import { IDrag } from './drag';

export interface IWebsiteImageMeta {
  src?: string;
  title?: string | null;
  ext?: string;
  width: number;
  height: number;
  base64?: string;
}

export interface IWebsiteImage extends IDrag {
  getMeta: (element: HTMLImageElement) => IWebsiteImageMeta;
  getTitle: (element: HTMLImageElement) => string | null;
  toBase64: (element: HTMLImageElement) => string;
}
