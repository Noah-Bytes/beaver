import type { IShellTypes } from './shell-types';

export interface IBinTypes {
  dir: string;
  installed: { [key: string]: string[] };
  init: () => Promise<void>;
  download: (url: string, dest: string) => Promise<void>;
  wget: (url: string, dest: string) => Promise<void>;
  rm: (src: string) => Promise<void>;
  mv: (src: string, dest: string) => Promise<void>;

  /**
   * 文件是否存在
   * @param path
   */
  exists: (...p: string[]) => boolean;

  absPath: (...p: string[]) => string;

  getModule: (name: string) => IBinModuleTypes | undefined;

  getModules: () => IBinModuleTypes[];

  removeAllModule: () => void;

  removeModule: (name: string) => void;

  createModule: (name: string, instantiate: IBinModuleTypes) => void;
}

export interface IBinModuleTypes {
  readonly dependencies?: string[];
  readonly shell: IShellTypes;
  env?: () => { [key: string]: any } | undefined;
  init?: () => Promise<void>;
  exists?: (pattern: string) => Promise<boolean>;
  install: () => Promise<void>;
  installed: () => boolean | Promise<boolean>;
  uninstall: () => Promise<void>;
  onstart?: () => string[];
}
