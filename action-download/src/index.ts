import { ActionUse } from '@beaver/action-core';
import { IDownloadOptions, IWthForDownload } from '@beaver/types';
import { DownloaderHelper } from 'node-downloader-helper';
import * as os from 'os';
import * as path from 'path';

export class ActionDownload extends ActionUse<IWthForDownload> {
  constructor(params: IWthForDownload, options?: IDownloadOptions) {
    super(params, options);
  }

  private getLogs(msg: string) {
    return msg + os.EOL;
  }

  private _download(): Promise<string> {
    let targetURL = this.with.url;
    const dir = path.resolve(this.home, this.with.path);

    const dl = new DownloaderHelper(targetURL, dir, {
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

    this.outStream.write(
      this.getLogs(`Downloading ${targetURL} to ${dir}/${this.with.file}`),
    );

    return new Promise((resolve, reject) => {
      dl.on('end', () => {
        this.outStream.write(this.getLogs('Download Complete!'));
        resolve('0');
      });

      dl.on('error', (e) => {
        this.errStream.write(this.getLogs(`Download Failed: ${e.message}`));
        reject(e);
      });

      dl.on('progress.throttled', (stats) => {
        this.outStream.write(
          this.getLogs(
            `Download ${stats.progress.toFixed(0)}% ${stats.downloaded}/${stats.total}`,
          ),
        );
      });

      dl.on('skip', (stats) => {
        this.outStream.write(this.getLogs(`File already exists`));
        resolve('0');
      });

      dl.start().catch((e) => {
        this.errStream.write(this.getLogs(`Download Failed: ${e.message}`));
        reject(e);
      });
    });
  }

  override async run(): Promise<string> {
    if (this.with.url && this.with.path && this.with.file) {
      return await this._download();
    }
    return '0';
  }
}
