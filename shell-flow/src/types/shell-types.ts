import { Terminal } from '../shell/terminal';

export interface IShellRunOptions {
  cols?: number;
  rows?: number;
  sudo?: boolean;
  path?: string;
  cwd?: string;
  env?: { [key: string]: string };
}

export interface IShellRunParams {
  message: string | string[];
  venv?: string;
  path?: string;
  conda?:
    | string
    | {
        args?: string;
        skip?: boolean;
        path?: string;
        name?: string;
        python?: string;
      };
}

export interface IShellMeta {
  status: number;
  name: string;
  groupName: string;
  terminal: string;
  args: string[];
  env: {
    [key: string]: string | undefined;
  };
}

export interface IShellTypes {
  status: number;

  readonly groupName: string;

  readonly name: string;

  terminal: string;

  args: string[];

  env: {
    [key: string]: string;
  };

  kill(): void;

  run(params: IShellRunParams, options?: IShellRunOptions): Promise<string>;

  getPty(): Terminal;

  execute(params: IShellRunParams, options?: IShellRunOptions): Promise<void>;

  /**
   * 初始化
   */
  init(options?: IShellRunOptions): void;

  onShellData(func: (data: string) => void): () => void;
  onShellExit(func: (data: string) => void): () => void;

  getMeta(): IShellMeta;
}
