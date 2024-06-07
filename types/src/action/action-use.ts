import * as stream from 'stream';
import { IWirtable } from './wirtable';

export interface IActionUseOptions extends IWirtable {
  silent?: boolean;
}

export interface IActionUse<T> {
  with: T;
  home: string;
  outStream?: stream.Writable;
  errStream?: stream.Writable;
  silent?: boolean;

  run: () => Promise<string>;
  kill: () => Promise<void>;
}
