import { IFileMeta } from '../file';

export interface Palette {
  color: number[];
  ratio: number;
}

export interface IImageMeta extends IFileMeta {
  palettes: Palette[];
}
