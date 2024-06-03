import { IShellMeta, IShellRunParams, IShellTypes } from './shell-types';

export interface IShellManagerTypes {
  /**
   * 获取shell
   * @param name
   */
  getShell(name: string): IShellTypes | undefined;

  /**
   * 获取所有shell
   */
  getShells(): IShellTypes[];

  getMates(): IShellMeta[];

  /**
   * 创建shell
   * @param name
   */
  createShell(name: string): IShellTypes;

  /**
   * 移除shell
   * @param name
   */
  removeShell(name: string): void;

  /**
   * 移除所有shell
   */
  removeAllShell(): void;

  run(name: string, params: IShellRunParams): Promise<string>;
}
