import { ITag } from '@beaver/types';
import { FileJson } from './file-json';
import {uuid} from "@beaver/arteffix-utils";

export class Tag extends FileJson<ITag> {
  constructor(rootDir: string) {
    super(rootDir, 'tag.json');
  }

  static createId(): string {
    return uuid('tag')
  }
}
