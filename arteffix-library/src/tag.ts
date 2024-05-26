import { ITag } from '@beaver/types';
import { FileJson } from './file-json';

export class Tag extends FileJson<ITag> {
  constructor(rootDir: string) {
    super(rootDir, 'tag.json');
  }
}
