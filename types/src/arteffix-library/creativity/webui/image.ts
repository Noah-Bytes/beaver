import { IImageMeta } from '../../media/image';

export type IImageWebuiResource = {
  type: string;
  name: string;
  weight?: number;
  hash?: string;
};

export type IImageWebuiDetail = {
  prompt?: string;
  negativePrompt?: string;
  steps?: string;
  sampler?: string;
  cfgScale?: string;
  seed?: string;
  clipSkip?: string;
  hashes?: { [k: string]: any };
  width?: number;
  height?: number;
  resources?: IImageWebuiResource[];
  Size?: string;
  size?: string;
} & Record<string, any>;

export interface IImageWebuiMeta extends IImageMeta {
  webui: IImageWebuiDetail;
}
