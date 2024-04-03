import * as os from 'os';

export function isWin32() {
  return os.platform() === 'win32';
}
