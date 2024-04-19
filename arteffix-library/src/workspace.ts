import { IWorkspace, IWorkspaceMeta } from '@beaver/types';
import * as fs from 'fs';
import * as path from 'path';
import { FileManage } from './file-manage';

export class Workspace implements IWorkspace {
  static version: string = '0.0.1';
  readonly rootDir: string;
  static META_NAME = 'metadata.json';
  meta: IWorkspaceMeta | undefined;
  readonly file: FileManage;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.file = new FileManage(rootDir);
  }

  async init() {
    if (!fs.existsSync(this.rootDir)) {
      await fs.promises.mkdir(this.rootDir);
    }

    if (!fs.existsSync(this.absPath(Workspace.META_NAME))) {
      await this.createMetadata();
    }

    await this.file.init();
  }

  async destroy() {}

  async createMetadata() {
    this.meta = {
      media: {
        folders: [],
        smartFolders: [],
        quickAccess: [],
        tagsGroups: [],
      },
      creativity: {
        folders: [],
        smartFolders: [],
        quickAccess: [],
        tagsGroups: [],
      },
      applicationVersion: Workspace.version,
      modificationTime: Date.now(),
    };

    await fs.promises.writeFile(
      this.absPath(Workspace.META_NAME),
      JSON.stringify(this.meta),
    );
  }

  readMetaData() {
    return require(this.absPath(Workspace.META_NAME));
  }

  absPath(...p: string[]): string {
    return path.resolve(this.rootDir, ...p);
  }
}
