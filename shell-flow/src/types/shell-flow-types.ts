import { SystemInfo } from '@beaver/shell-flow';
import { IWirtable } from '@beaver/types';

export interface IShellFlowOptionsTypes extends IWirtable {
  homeDir?: string;
  mirror?: Record<string, string>;
  requirement?: (data: string) => void;
}

export interface IShellFlowTypes {
  readonly appName: string;
  readonly homeDir: string;
  readonly systemInfo: SystemInfo;
  readonly options?: IShellFlowOptionsTypes;

  changeHomeDir: (dir: string) => Promise<void>;

  init: () => Promise<void>;

  initCacheDir: () => Promise<void>;

  destroy: () => Promise<void>;

  absPath: (p: string) => string;

  mirrorUrl: (url: string) => string;
}
