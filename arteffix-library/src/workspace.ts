import {
  IFileBaseMeta,
  IFileBaseMetaUpdate,
  IWorkspace,
  IWorkspaceMeta,
} from '@beaver/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FileManage } from './file-manage';

export class Workspace implements IWorkspace {
  static version: string = '0.0.1';
  readonly rootDir: string;
  static META_NAME = 'metadata.json';
  meta: IWorkspaceMeta = {
    folders: {
      root: {
        children: [],
        isFolder: true,
        canMove: true,
        canRename: true,
        index: 'root',
        data: {
          id: 'root',
          name: '根',
          modificationTime: Date.now(),
        },
      },
    },
    smartFolders: {
      root: {
        children: [],
        isFolder: true,
        canMove: true,
        canRename: true,
        index: 'root',
        data: {
          id: 'root',
          name: '根',
          modificationTime: Date.now(),
          children: [],
          conditions: [],
        },
      },
    },
    quickAccess: [],
    tagsGroups: [],
    applicationVersion: Workspace.version,
    modificationTime: Date.now(),
  };
  readonly file: FileManage<IFileBaseMeta, IFileBaseMetaUpdate>;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.file = new FileManage(rootDir);
  }

  async init() {
    if (!fs.existsSync(this.rootDir)) {
      await fs.promises.mkdir(this.rootDir);
    }

    if (!fs.existsSync(this.absPath(Workspace.META_NAME))) {
      await this.saveMetadata();
    } else {
      this.readMetaData();
    }

    await this.file.init();
  }

  async destroy() {}

  public async updateMeta(meta: IWorkspaceMeta) {
    this.meta = {
      ...this.meta,
      ...meta,
    };
    await this.saveMetadata();
  }

  async saveMetadata() {
    await fs.writeJson(this.absPath(Workspace.META_NAME), this.meta);
  }

  readMetaData() {
    this.meta = require(this.absPath(Workspace.META_NAME));
    return this.meta;
  }

  absPath(...p: string[]): string {
    return path.resolve(this.rootDir, ...p);
  }
}
