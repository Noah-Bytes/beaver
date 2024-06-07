import { IShellAppMeta, IShellAppRun } from '@beaver/types';
import { ReadCommitResult } from 'isomorphic-git';

export interface IAppMeta extends IShellAppMeta {
  name: string;
  status: number;
  git: string;
  dir: string;
  lastModified?: number;
  steps?: IStep[];
}

export interface IAppMetaUpdate {
  status?: number;
}

export interface IStep {
  status: number;
  run: IShellAppRun;
  message?: string;
}

export interface IAppTypes {
  readonly name: string;
  readonly git: string;
  steps: any[];

  setSteps: (runs: IShellAppRun[]) => void;
  init: () => Promise<void>;
  getMeta: () => Promise<IAppMeta>;
  install: () => Promise<void>;
  load: (filename: string) => Promise<any>;
  readLog: (name: string) => Promise<string>;
  logs: () => Promise<ReadCommitResult[]>;
  saveMetadata: () => Promise<boolean>;
  readMetaData: () => Promise<IAppMeta | undefined>;
  updateMeta: (meta: IAppMetaUpdate) => Promise<void>;

  unInstall: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  update: () => Promise<void>;
  retry: () => Promise<void>;
  jump: () => Promise<void>;
}
