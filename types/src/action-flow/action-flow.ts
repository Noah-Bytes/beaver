import { IWirtable } from '@beaver/types';

export interface IFlowOptionsTypes extends IWirtable {
  homeDir?: string;
  mirror?: Record<string, string>;
}

export interface IShellFlowTypes {
  readonly appName: string;
  readonly homeDir: string;
  readonly options?: IFlowOptionsTypes;

  changeHomeDir: (dir: string) => Promise<void>;

  init: () => Promise<void>;

  initCacheDir: () => Promise<void>;

  destroy: () => Promise<void>;

  absPath: (p: string) => string;

  mirrorUrl: (url: string) => string;
}
