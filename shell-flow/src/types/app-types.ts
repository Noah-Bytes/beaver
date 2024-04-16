import { IShellAppMeta } from '@beaver/types';
import { ReadCommitResult } from 'isomorphic-git';

export interface IAppMeta extends IShellAppMeta {
  name: string;
  status: number;
  git: string;
  dir: string;
}

export interface IAppTypes {
  readonly name: string;
  readonly git: string;

  isInit: () => boolean;
  init: () => Promise<void>;
  getMeta: () => IAppMeta;
  absPath: (...arg: string[]) => string;
  exists: (...p: string[]) => boolean;
  install: () => Promise<void>;
  load: (filename: string) => Promise<any>;
  unInstall: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  update: () => Promise<void>;

  logs: () => Promise<ReadCommitResult[]>;
}
