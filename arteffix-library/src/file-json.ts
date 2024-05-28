import { safeAccessSync } from '@beaver/arteffix-utils';
import { IFileJson } from '@beaver/types';
import fs from 'fs-extra';
import path from 'path';

export class FileJson<O> implements IFileJson<O> {
  get json(): O {
    if (!this._init) {
      throw new Error('File not initialized');
    }
    return this._json;
  }

  set json(value: O) {
    this._json = value;
  }
  readonly filename: string;
  readonly rootDir: string;
  readonly filepath: string;
  readonly defaultValue: O;
  private _init = false;
  private _json: O;

  constructor(rootDir: string, filename: string, defaultValue: O) {
    this.filename = filename;
    this.rootDir = rootDir;
    this.filepath = path.resolve(this.rootDir, this.filename);
    this.defaultValue = defaultValue;
    this._json = JSON.parse(JSON.stringify(defaultValue));
  }
  async destroy(): Promise<boolean> {
    try {
      await fs.remove(this.filepath);
      this._json = JSON.parse(JSON.stringify(this.defaultValue));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async init(): Promise<void> {
    safeAccessSync(this.rootDir);
    try {
      this._init = true;
      const result = await fs.readJson(this.filepath);
      if (result) {
        this._json = result;
      }
    } catch (e) {
      console.error(e);
    }
  }
  async save(): Promise<boolean> {
    try {
      await fs.writeJson(this.filepath, this.json);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
