import { IFileMetaUpdate, IImageMeta, Palette } from '@beaver/types';
import { File } from '../../file';
// @ts-ignore
import * as palette from 'image-palette';

export class Image extends File<IImageMeta, IFileMetaUpdate> {
  constructor(dir: string, meta: IImageMeta) {
    if (!meta.type) {
      meta.type = File.TYPE.image;
    }
    super(dir, meta);
  }

  async updatePalette() {
    const filePath = this.absPath(this.getFileName());
    const p: {
      colors: [number, number, number, number][];
      amount: number[];
    } = palette(filePath);

    const palettes: Palette[] = [];

    for (let i = 0; i < p.colors.length; i++) {
      palettes.push({
        color: p.colors[i],
        ratio: p.amount[i],
      });
    }

    await this.updateMeta({
      // @ts-ignore
      palettes,
    });
  }
}
