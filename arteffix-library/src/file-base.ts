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
  async save(data: any) {
    await fs.ensureDir(this.absPath(), 0o755);

    if (!this.exists(FileBase.META_NAME)) {
      await this.saveMetadata();
    }

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.promises.writeFile(filePath, data, {
        mode: '0755',
      });
    }
  }

  async copy() {
    await fs.ensureDir(this.absPath(), {
      mode: 0o2775,
    });

    if (!this.exists(FileBase.META_NAME)) {
      await this.saveMetadata();
    }

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.copyFile(this.meta.url!, filePath);
    }
  }
}
