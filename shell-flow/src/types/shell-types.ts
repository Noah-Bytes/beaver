export interface IShellRunOptions {
  cols?: number;
  rows?: number;
  sudo?: boolean;
  path?: string;
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

export interface IShellTypes {
  name: string;

  terminal: string;

  args: string[];

  env: {
    [key: string]: string | undefined;
  };

  /**
   * 给终端发送信息
   * @param message
   * @param isExe 是否执行
   */
  send(message: string, isExe: boolean): void;

  /**
   * 清理终端
   */
  clear(): void;

  kill(): void;

  run(params: IShellRunParams, options?: IShellRunOptions): Promise<string>;

  /**
   * 初始化
   */
  init(options?: IShellRunOptions): void;

  isInit(): boolean;

  onShellData(func: (data: string) => void): () => void;
  onShellExit(func: (data: string) => void): () => void;
}
