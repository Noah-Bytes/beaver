import { IShellAppMeta } from '@beaver/types';
import { ReadCommitResult } from 'isomorphic-git';

export interface IAppMeta extends IShellAppMeta {
  name: string;
  status: number;
  git: string;
  dir: string;
  lastModified?: number
}

export interface IAppMetaUpdate {
  status?: number
}

export interface IAppTypes {
  readonly name: string;
  readonly git: string;

  init: () => Promise<void>;
  getMeta: () => Promise<IAppMeta>;
  absPath: (...arg: string[]) => string;
  exists: (...p: string[]) => boolean;
  install: () => Promise<void>;
  load: (filename: string) => Promise<any>;
  unInstall: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  update: () => Promise<void>;
  readLog: (name: string) => Promise<string>;
  logs: () => Promise<ReadCommitResult[]>;
  saveMetadata: () => Promise<boolean>
  readMetaData: () => Promise<IAppMeta | undefined>
  updateMeta: (meta: IAppMetaUpdate) => Promise<void>;
}
