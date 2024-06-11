import { IKey, IShellAppRequires } from '@beaver/types';
import { ShellFlow } from '../shell-flow';

export interface IBinTypes {
  readLog: () => Promise<string>;
  init: () => Promise<void>;
  download: (url: string, dest: string) => Promise<void>;
  rm: (src: string) => Promise<void>;
  checkInstalled: () => Promise<void>;
  install: (list: IShellAppRequires[]) => Promise<void>;
  checkIsInstalled: (
    name: string | string[],
    type?: string,
  ) => Promise<boolean>;
}

export interface IBinModuleTypes {
  readonly _ctx: ShellFlow;
  readonly dependencies?: string[];
  init?: () => Promise<void>;
  exists?: (pattern: string) => Promise<boolean>;
  install: () => Promise<void>;
  installed: () => boolean | Promise<boolean>;
  uninstall: () => Promise<void>;
  run: (command: string | string[]) => Promise<string>;
  runNotConda: (command: string | string[]) => Promise<string>;
}
