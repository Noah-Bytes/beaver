import os from 'os';

export function isWin32() {
  return os.platform() === 'win32';
}

export function isDarwin() {
  return os.platform() === 'darwin';
}
