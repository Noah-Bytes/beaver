import fs from 'fs';

export function isDirectory(p: string) {
  return fs.lstatSync(p).isDirectory();
}
