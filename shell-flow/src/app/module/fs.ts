import { mirror } from '@beaver/action-core';
import { createLogger, ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';
import { DownloaderHelper } from 'node-downloader-helper';
import path from 'path';
// @ts-ignore
import Pdrive from 'pdrive';
import { rimraf } from 'rimraf';
import { Logger } from 'winston';

export class Fs {
  private readonly _ctx: ShellFlow;
  readonly logger: Logger;

  constructor(private readonly ctx: any) {
    this._ctx = ctx;
    this.logger = createLogger(`fs`);
  }

  async share(params: IShellAppRunParams) {
    if (params.drive) {
      const drivePath = this._ctx.absPath('drive');
      const drive = new Pdrive(drivePath);

      for (let driveKey in params.drive) {
        const link = params.drive[driveKey];

        if (Array.isArray(link)) {
          let toContinue = false;
          for (let string of link) {
            if (path.isAbsolute(string) || string.startsWith('.')) {
              toContinue = true;
              break;
            }
          }

          if (toContinue) continue;
        } else {
          if (path.isAbsolute(link) || link.startsWith('.')) {
            continue;
          }
        }

        if (path.isAbsolute(driveKey) || driveKey.startsWith('.')) {
          break;
        }

        let linkPath;
        if (Array.isArray(link)) {
          linkPath = link.map((ln) => {
            return path.resolve(params?.cwd || '', ln);
          });
        } else {
          linkPath = path.resolve(params?.cwd || '', link);
        }

        params.drive[driveKey] = linkPath;
      }

      console.log('call drive.create');
      await drive.create({
        uri: params.git,
        drive: params.drive,
        peers: params.peers ? params.peers : [],
      });
    }
  }

  private async _download(
    url: string,
    dest: string,
    dir: string,
  ): Promise<void> {
    const { options } = this._ctx;
    let targetURL = url;

    if (options?.isMirror) {
      targetURL = mirror(targetURL);
      this.logger.info('Using mirror: ' + targetURL);
    }

    const dl = new DownloaderHelper(targetURL, dir, {
      fileName: dest,
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
    return new Promise((resolve, reject) => {
      dl.on('end', () => {
        this.logger.info('Download Complete!');
        resolve();
      });

      dl.on('error', (e) => {
        this.logger.error(`event: Download Failed: ${e.message}`);
      });

      dl.on('progress.throttled', (stats) => {
        this.logger.info(
          `Download ${stats.progress} ${stats.downloaded}/${stats.total}`,
        );
      });

      this.logger.info(`Downloading ${targetURL} to ${dir}/${dest}`);
      dl.start().catch((e) => {
        this.logger.error(`start: Download Failed: ${e.message}`);
        reject(e);
      });
    });
  }

  async download(params: IShellAppRunParams) {
    if (params.url && params.dir && params.cwd) {
      if (Array.isArray(params.url)) {
        for (let urlElement of params.url) {
          await this._download(urlElement, params.dir, params.cwd);
        }
      } else {
        await this._download(params.url, params.dir, params.cwd);
      }
    }
  }

  async rm(params: IShellAppRunParams) {
    if (params.path) {
      await rimraf(params.path);
    }
  }
}
