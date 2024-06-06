import {
  IActionUseOptions,
  IWirtable,
  IWithForShellConda,
} from '@beaver/types';

export interface IActionShellCondaOptions extends IActionUseOptions {}

export interface IActionShell extends IWirtable {
  run: (params: IWithForShellConda) => Promise<number>;
}
