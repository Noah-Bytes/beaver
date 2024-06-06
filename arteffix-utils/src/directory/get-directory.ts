import * as path from 'path';
import { isDirectory } from './is-directory';

export function getDirectory(p: string) {
  if (isDirectory(p)) {
    return p;
  }

  return path.dirname(p);
}
