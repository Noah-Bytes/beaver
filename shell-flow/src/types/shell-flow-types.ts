import { SystemInfo } from '@beaver/shell-flow';

export interface IShellFlowOptionsTypes {
  isMirror?: boolean;
  homeDir?: string;
}

export interface IShellFlowTypes {
  readonly appName: string;
  readonly homeDir: string;
  readonly systemInfo: SystemInfo;
  readonly options?: IShellFlowOptionsTypes;

  changeHomeDir: (dir: string) => Promise<void>;

  init: () => Promise<void>;

  destroy: () => Promise<void>;

  absPath: (p: string) => string;
}
