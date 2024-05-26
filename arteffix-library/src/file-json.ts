import { safeAccessSync } from '@beaver/arteffix-utils';
import { IFileJson } from '@beaver/types';
import fs from 'fs-extra';
import path from 'path';

export class FileJson<O> implements IFileJson<O> {
  readonly filename: string;
  readonly rootDir: string;
  readonly filepath: string;

  constructor(rootDir: string, filename: string) {
    this.filename = filename;
    this.rootDir = rootDir;
    this.filepath = path.resolve(this.rootDir, this.filename);
  }
  async destroy(): Promise<boolean> {
    try {
      await fs.remove(this.filepath);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async read(): Promise<O | undefined> {
    safeAccessSync(this.rootDir);
    try {
      return await fs.readJson(this.filepath);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
  async save(json: any): Promise<boolean> {
    try {
      await fs.writeJson(this.filepath, json);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
