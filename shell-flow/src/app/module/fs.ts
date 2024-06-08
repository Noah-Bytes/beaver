import { ActionDownload } from '@beaver/action-download';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';
import path from 'path';
// @ts-ignore
import Pdrive from 'pdrive';
import { rimraf } from 'rimraf';

export class Fs {
  private readonly _ctx: ShellFlow;

  constructor(private readonly ctx: any) {
    this._ctx = ctx;
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
    const { options, mirrorUrl, homeDir, errStream, outStream } = this._ctx;
    let targetURL = url;

    if (options?.mirror) {
      targetURL = mirrorUrl(targetURL);
      outStream.write('Using mirror: ' + targetURL);
    }

    const actionDownload = new ActionDownload(
      {
        url: targetURL,
        home: homeDir,
        path: dir,
        file: dest,
      },
      {
        errStream,
        outStream,
      },
    );

    await actionDownload.run();
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
