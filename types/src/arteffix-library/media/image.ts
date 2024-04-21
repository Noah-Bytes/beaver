import { IFileMeta } from '../file';

export interface Palette {
  color: number[];
  ratio: number;
}

export interface IImageMeta extends IFileMeta {
  palettes: Palette[];

  /**
   * 尺寸：高
   */
  height: number;

  /**
   * 尺寸：宽
   */
  width: number;
}
