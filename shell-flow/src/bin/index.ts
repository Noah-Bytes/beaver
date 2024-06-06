import { ActionDownload } from '@beaver/action-download';
import { ActionFs } from '@beaver/action-fs';
import { ShellConda } from '@beaver/shell-conda';
import { IShellAppRequires } from '@beaver/types';
import fs from 'fs-extra';
import { Directory } from '../directory';
import { ShellFlow } from '../shell-flow';
import { IBinModuleTypes, IBinTypes } from '../types/bin-types';

export class Bin extends Directory<IBinModuleTypes> implements IBinTypes {
  private readonly _ctx: ShellFlow;

  private _installed = {
    conda: new Set<string>(),
    brew: new Set<string>(),
    pip: new Set<string>(),
  };

  constructor(ctx: ShellFlow) {
    super(ctx.absPath('bin'));
    this._ctx = ctx;
  }

  readLog(): Promise<string> {
    return fs.readFile(this.absPath('bin.log'), 'utf8');
  }

  async init(): Promise<void> {
    await fs.promises.mkdir(this.dir, { recursive: true });
    await this.initModule();
    await this.checkInstalled();
  }

  async download(url: string, dest: string): Promise<void> {
    await new ActionDownload({
      home: this._ctx.homeDir,
      url: url,
      file: dest,
      path: 'bin',
    }).run();
  }

  async rm(src: string): Promise<void> {
    await new ActionFs({
      type: 'rm',
      home: this._ctx.homeDir,
      file: src,
      path: this.absPath(),
    }).run();
  }

  async checkInstalled(): Promise<void> {
    const { systemInfo, errStream } = this._ctx;
    const existsConda = this.exists('miniconda');

    // 检测 conda 已安装
    const conda = new Set<string>();

    if (existsConda) {
      try {
        const actionConda = new ShellConda(
          {
            home: this._ctx.homeDir,
            run: 'conda list',
          },
          {
            silent: true,
          },
        );
        const result = await actionConda.run();

        const lines = result.split(/[\r\n]+/);
        let start;
        for (let line of lines) {
          if (start) {
            let chunks = line.split(/\s+/).filter((x) => x);
            if (chunks.length > 1) {
              conda.add(chunks[0]);
            }
          } else {
            if (/name.*version.*build.*channel/i.test(line)) {
              start = true;
            }
          }
        }
      } catch (e: any) {
        errStream.write(`conda list: ${e.message}`);
      }
    }

    this._installed.conda = conda;

    // 检查pip已安装
    const pip = new Set<string>();

    if (existsConda) {
      try {
        const actionConda = new ShellConda(
          {
            home: this._ctx.homeDir,
            run: 'pip list',
          },
          {
            silent: true,
          },
        );
        const result = await actionConda.run();

        const lines = result.split(/[\r\n]+/);
        let start;
        for (let line of lines) {
          if (start) {
            let chunks = line.split(/\s+/).filter((x) => x);
            if (chunks.length > 1) {
              pip.add(chunks[0]);
            }
          } else {
            if (/-------.*/i.test(line)) {
              start = true;
            }
          }
        }
      } catch (e: any) {
        errStream.write(`pip list: ${e.message}`);
      }
    }

    this._installed.pip = pip;

    if (['darwin', 'linux'].includes(systemInfo.platform)) {
      let brew: string[] = [];
      if (this.exists('homebrew')) {
        const actionConda = new ShellConda(
          {
            home: this._ctx.homeDir,
            run: 'brew list -1',
          },
          {
            silent: true,
          },
        );
        const result = await actionConda.run();

        const lines = result.split(/[\r\n]+/);
        let start, end;
        for (let line of lines) {
          if (start) {
            if (/^\s*$/.test(line)) {
              end = true;
            } else {
              if (!end) {
                let chunks = line.split(/\s+/).filter((x) => x);
                brew = brew.concat(chunks);
              }
            }
          } else {
            if (/==>/.test(line)) {
              start = true;
            }
          }
        }
      }

      this._installed.brew = new Set(brew);
    }
  }

  private async _isInstalled(
    name: string,
    type?: string | undefined,
  ): Promise<boolean> {
    switch (type) {
      case 'conda':
        return this._installed.conda.has(name);
      case 'pip':
        return this._installed.pip.has(name);
      case 'brew':
        return this._installed.brew.has(name);
      default:
        if (this.hasModule(name)) {
          try {
            const isInstalled = await this.getModule(name)?.installed();
            return !!isInstalled;
          } catch {
            return false;
          }
        }
        return false;
    }
  }

  private _isMatch(current: string, value?: string | string[]) {
    return (
      !value ||
      value === current ||
      (Array.isArray(value) && value.includes(current))
    );
  }

  async install(list: IShellAppRequires[]): Promise<void> {
    const { systemInfo } = this._ctx;
    const _list = list.filter(
      (elem) =>
        this._isMatch(systemInfo.platform, elem.platform) &&
        this._isMatch(systemInfo.arch, elem.arch) &&
        this._isMatch(systemInfo.GPU!, elem.gpu),
    );
    await fs.truncate(this.absPath('bin.log'), 0);
    for (let { name, args, type } of _list) {
      if (await this.checkIsInstalled(name, type)) {
        continue;
      }

      const _name: string[] = Array.isArray(name) ? name : [name];

      if (type) {
        let cmd;
        switch (type) {
          case 'conda':
            await this.getModule('conda')?.install();
            cmd = `conda install -y ${args} ${_name.join(' ')}`;
            break;
          case 'pip':
            cmd = `pip install ${args} ${_name.join(' ')}`;
            break;
          case 'brew':
            await this.getModule('brew')?.install();
            cmd = `brew install ${args} ${_name.join(' ')}`;
            break;
        }

        if (cmd) {
          const condaShell = new ShellConda({
            home: this._ctx.homeDir,
            run: cmd,
          });
          await condaShell.run();
        }
      } else {
        for (let n of _name) {
          if (this.hasModule(n)) {
            await this.getModule(n)?.install();
          }
        }
      }
    }

    await this.checkInstalled();
  }

  async checkIsInstalled(
    name: string | string[],
    type?: string | undefined,
  ): Promise<boolean> {
    if (Array.isArray(name)) {
      for (let n of name) {
        let installed = await this._isInstalled(n, type);
        if (!installed) return false;
      }
      return true;
    }

    return this._isInstalled(name, type);
  }

  private _mergeEnv(
    existing: Record<string, string | string[]>,
    merge: Record<string, string | string[]>,
  ) {
    // merge 'merge' into 'existing'
    for (let key in merge) {
      if (Array.isArray(merge[key])) {
        if (typeof existing[key] === 'undefined') {
          existing[key] = merge[key];
        } else {
          // if the env value is an array, it should be PREPENDED to the existing, in order to override
          if (existing[key]) {
            // @ts-ignore
            existing[key] = merge[key].concat(existing[key]);
          } else {
            existing[key] = merge[key];
          }
        }
      } else {
        existing[key] = merge[key];
      }
    }
    return existing;
  }
}
