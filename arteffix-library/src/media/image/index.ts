import { IFileMetaUpdate, IImageMeta } from '@beaver/types';
import { File } from '../../file';

export class Image extends File<IImageMeta, IFileMetaUpdate> {
  constructor(dir: string, meta: IImageMeta) {
    if (!meta.type) {
      meta.type = File.TYPE.image;
    }
    super(dir, meta);
  }
}
