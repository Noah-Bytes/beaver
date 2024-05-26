import { safeAccessSync } from '@beaver/arteffix-utils';
import {
  IFileBaseMeta,
  IFileBaseMetaUpdate,
  IWorkspace,
  IWorkspaceMeta,
  IWorkspaceMetaUpdate,
} from '@beaver/types';
import fs from 'fs-extra';
import path from 'path';
import { FileBase } from './file-base';
import { FileManage } from './file-manage';
import { Tag } from './tag';

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
  tags: Tag;
  readonly file: FileManage<
    FileBase<IFileBaseMeta, IFileBaseMetaUpdate>,
    IFileBaseMeta,
    IFileBaseMetaUpdate
  >;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.file = new FileManage(rootDir);
    this.tags = new Tag(rootDir);
  }

  async init() {
    if (!fs.existsSync(this.rootDir)) {
      await fs.promises.mkdir(this.rootDir, {
        mode: '0755',
      });
    }

    if (!fs.existsSync(this.absPath(Workspace.META_NAME))) {
      await this.saveMetadata();
    } else {
      await this.readMetaData();
    }

    await this.file.init();
  }

  async destroy() {}

  public async updateMeta(meta: IWorkspaceMetaUpdate) {
    this.meta = {
      ...this.meta,
      ...meta,
    };
    await this.saveMetadata();
  }

  async saveMetadata() {
    await fs.writeJson(this.absPath(Workspace.META_NAME), this.meta);
  }

  async readMetaData() {
    safeAccessSync(this.absPath());
    this.meta = await fs.readJson(this.absPath(Workspace.META_NAME));
    return this.meta;
  }

  absPath(...p: string[]): string {
    return path.resolve(this.rootDir, ...p);
  }
}
