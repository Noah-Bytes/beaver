import { IDrag } from './drag';

export interface IWebsiteImageMeta {
  src?: string;
  title?: string;
  origin?: string
  base64?: string;
}

export interface IWebsiteImage extends IDrag {}
