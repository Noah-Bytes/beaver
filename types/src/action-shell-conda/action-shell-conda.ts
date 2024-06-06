import { IWirtable, IWithForShellConda } from '@beaver/types';

export interface IActionShellCondaOptions extends IWirtable {}

export interface IActionShell extends IWirtable {
  run: (params: IWithForShellConda) => Promise<number>;
}
