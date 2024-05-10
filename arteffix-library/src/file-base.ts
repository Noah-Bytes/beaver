import { MetaFile } from '@beaver/kernel';
import { IFileBaseMeta, IFileBaseMetaUpdate, IFileExtend } from '@beaver/types';
import fs from 'fs-extra';

export class FileBase<M extends IFileBaseMeta, U extends IFileBaseMetaUpdate>
  extends MetaFile<M, U>
  implements IFileExtend<M, U>
{
  static fileTypes: string[] = [];

  constructor(rootDir: string, meta: M) {
    super(rootDir, meta);
  }

  async copy() {
    await this.init();

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.copyFile(this.meta.url!, filePath);
    }
  }
}
