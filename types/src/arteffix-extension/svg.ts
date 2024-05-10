import { IDrag } from './drag';

export interface IWebsiteSVGMeta {
  title?: string;
  ext: string;
  width: number;
  height: number;
  origin?: string;
  svg: string;
}

export interface IWebsiteSvg extends IDrag {}
