import {IDrag, IWebsiteImageMeta} from '@beaver/types';

export interface IWebsiteLink extends IDrag {
  getOrigin: () => string;
  getTitle: () => string | undefined;
  getSrc: () => string | undefined;
  getRealUrl: (url: string) => string;
}
