import * as os from 'os';
import * as path from 'path';
import * as process from 'process';

export const HOME =
  process.env['ARTEFFIX_HOME'] || path.join(os.homedir(), 'arteffix.shell');
