import { SystemInfo } from '@beaver/shell-flow';

export interface IShellFlowOptionsTypes {
  isMirror?: boolean;
  mirror?: Record<string, string>;
  homeDir?: string;
  termWrite?: (data: string) => void
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

  mirrorUrl: (url: string) => string;
}
