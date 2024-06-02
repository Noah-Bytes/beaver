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
  }
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

  /**
   * 给终端发送信息
   * @param message
   * @param options 配置
   */
  send(
    message: string,
    options: {
      isExe: boolean;
      isFlag: boolean;
    },
  ): void;

  /**
   * 清理终端
   */
  clear(): void;

  pause(): void;
  resume(): void;

  kill(): void;

  run(params: IShellRunParams, options?: IShellRunOptions): Promise<string>;

  execute(params: IShellRunParams, options?: IShellRunOptions): Promise<void>;

  /**
   * 初始化
   */
  init(options?: IShellRunOptions): void;

  isInit(): boolean;

  onShellData(func: (data: string) => void): () => void;
  onShellExit(func: (data: string) => void): () => void;

  getMeta(): IShellMeta;
}
