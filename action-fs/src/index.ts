import { ActionUse } from '@beaver/action-core';
import {
  IDownloadOptions,
  IWthForFs,
  IWthForFsCopy,
  IWthForFsDecompress,
  IWthForFsOutputFile,
  IWthForFsRm,
} from '@beaver/types';
import * as decompress from 'decompress';
import * as fs from 'fs-extra';
import * as path from 'path';

// @ts-ignore
const _decompress = decompress as unknown as typeof decompress.default;

export class ActionFs extends ActionUse<IWthForFs> {
  constructor(params: IWthForFs, options?: IDownloadOptions) {
    super(params, options);
  }

  async copy() {
    const params = this.with as IWthForFsCopy;
    const source = path.resolve(this.home, params.path, params.from);
    const target = path.resolve(this.home, params.path, params.to);
    this.outStream.write(`copy ${source} to ${target}`);
    try {
      await fs.copy(source, target);
      this.outStream.write(`copy success`);
    } catch (e: any) {
      this.errStream.write(`copy error: ${e.message}`);
      throw e;
    }
  }

  async rm() {
    const params = this.with as IWthForFsRm;
    const p = path.resolve(this.home, params.path, params?.file || '');
    this.outStream.write(`remove ${p}`);
    try {
      await fs.rm(p, {
        recursive: true,
        maxRetries: 3,
        retryDelay: 1000,
      });
      this.outStream.write(`remove success`);
    } catch (e: any) {
      this.outStream.write(`remove error: ${e.message}`);
      throw e;
    }
  }

  async decompress() {
    const params = this.with as IWthForFsDecompress;
    const p = path.resolve(this.home, params.path, params?.file || '');
    const output = path.resolve(this.home, params.path, params?.output || '');
    await _decompress(p, output, { strip: params.strip || 0 });
  }

  async outputFile() {
    const params = this.with as IWthForFsOutputFile;
    await fs.outputFile(
      path.resolve(this.home, params.path || '', params?.file || ''),
      params.content,
    );
  }

  override async run(): Promise<string> {
    switch (this.with.type) {
      case 'copy':
        await this.copy();
        break;
      case 'rm':
        await this.rm();
        break;
      case 'decompress':
        await this.decompress();
        break;
      case 'outputFile':
        await this.outputFile();
        break;
      default:
    }

    return '0';
  }
}
