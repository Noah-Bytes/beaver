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
    const result = [];
    result.push(`copy ${source} to ${target}`);
    this.outStream.write(`copy ${source} to ${target}`);
    try {
      await fs.copy(source, target);
      result.push(`copy success`);
      this.outStream.write(`copy success`);
    } catch (e: any) {
      this.errStream.write(`copy error: ${e.message}`);
      throw new Error(`copy error: ${e.message}`);
    }

    return result;
  }

  async rm() {
    const params = this.with as IWthForFsRm;
    const p = path.resolve(this.home, params.path, params?.file || '');
    const result = [`remove ${p}`];
    this.outStream.write(`remove ${p}`);
    try {
      await fs.rm(p, {
        recursive: true,
        maxRetries: 3,
        retryDelay: 1000,
      });
      this.outStream.write(`remove success`);
      result.push(`remove success`);
    } catch (e: any) {
      this.outStream.write(`remove error: ${e.message}`);
      throw new Error(`remove error: ${e.message}`);
    }

    return result;
  }

  async decompress() {
    const params = this.with as IWthForFsDecompress;
    const p = path.resolve(this.home, params.path, params?.file || '');
    const output = path.resolve(this.home, params.path, params?.output || '');
    const result = [`decompress ${p} to ${output}`];
    await _decompress(p, output, { strip: params.strip || 0 });
    result.push('decompress success');
    return result;
  }

  async outputFile() {
    const params = this.with as IWthForFsOutputFile;
    const p = path.resolve(this.home, params.path || '', params?.file || '');
    const result = [`outputFile ${p}`];
    await fs.outputFile(p, params.content);

    result.push('outputFile success');
    return result;
  }

  override async run(): Promise<string | string[]> {
    switch (this.with.type) {
      case 'copy':
        return await this.copy();
      case 'rm':
        return await this.rm();
      case 'decompress':
        return await this.decompress();
      case 'outputFile':
        return await this.outputFile();
    }
  }
}
