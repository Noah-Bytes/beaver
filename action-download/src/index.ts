import { ActionUse } from '@beaver/action-core';
import { IDownloadOptions, IWthForDownload } from '@beaver/types';
import * as fs from 'fs-extra';
import { DownloaderHelper } from 'node-downloader-helper';
import * as os from 'os';
import * as path from 'path';

export class ActionDownload extends ActionUse<IWthForDownload> {
  private logs: string[] = [];
  private dl?: DownloaderHelper;

  constructor(params: IWthForDownload, options?: IDownloadOptions) {
    super(params, options);
  }

  private log(msg: string) {
    this.outStream.write(msg + os.EOL);
    this.logs.push(msg);
  }

  private async _download(): Promise<string | string[]> {
    let targetURL = this.with.url;
    const dir = path.resolve(this.home, this.with.path);

    await fs.promises.mkdir(dir, { recursive: true });

    this.dl = new DownloaderHelper(targetURL, dir, {
      fileName: this.with.file,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0',
      },
      override: {
        skip: true,
        skipSmaller: false,
      },
      resumeIfFileExists: true,
      removeOnStop: false,
      removeOnFail: false,
      retry: { maxRetries: 3, delay: 5000 },
    });

    this.log(`Downloading ${targetURL} to ${dir}/${this.with.file}`);

    return new Promise((resolve, reject) => {
      this.dl.on('end', () => {
        this.log('Download Complete!');
        resolve(this.logs);
      });

      this.dl.on('error', (e) => {
        this.log(`Download Failed: ${e.message}`);
        reject(this.logs);
      });

      this.dl.on('progress.throttled', (stats) => {
        this.log(
          `Download ${stats.progress.toFixed(0)}% ${stats.downloaded}/${stats.total}`,
        );
      });

      this.dl.on('skip', (stats) => {
        this.log(`File already exists`);
        resolve(this.logs);
      });

      this.dl.start().catch((e) => {
        this.log(`Download Failed: ${e.message}`);
        reject(this.logs);
      });
    });
  }

  override async run(): Promise<string | string[]> {
    if (this.with.url && this.with.path && this.with.file) {
      return await this._download();
    }
    return '0';
  }

  async kill(): Promise<void> {
    await this.dl?.stop();
  }
}
