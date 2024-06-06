import * as stream from 'stream';
import { IWirtable } from './wirtable';

export interface IActionUseOptions extends IWirtable {}

export interface IActionUse<T> {
  with: T;
  home: string;
  outStream?: stream.Writable;
  errStream?: stream.Writable;

  run: () => Promise<string>;
}
