import { IDrag } from './drag';

export interface IWebsiteImageMeta {
  type: string;
  folderId?: string;
  src?: string;
  ext?: string;
  title?: string;
  origin?: string;
  base64?: string;
}

export interface IWebsiteImage extends IDrag {
  getOrigin: () => string | undefined;
  getTitle: () => string | undefined;
  getSrc: () => string;
  getBase64Meta: () => Promise<IWebsiteImageMeta | undefined>;
  getRealUrl: (url: string) => string;
}
