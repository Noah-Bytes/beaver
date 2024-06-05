import * as stream from 'stream';

export interface IWirtable {
  /** optional out stream to use. Defaults to process.stdout */
  outStream?: stream.Writable;

  /** optional err stream to use. Defaults to process.stderr */
  errStream?: stream.Writable;
}
