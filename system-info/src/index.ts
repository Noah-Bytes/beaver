import * as os from 'os';
export * from './gpu';

export const platform: 'win32' | 'linux' | 'darwin' = os.platform() as
  | 'win32'
  | 'linux'
  | 'darwin';

export const arch: 'x64' | 'arm64' = os.arch() as 'x64' | 'arm64';
