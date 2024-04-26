import { loader, ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';
import fs from 'fs';
import path from 'path';

export class Json {
  private readonly _ctx: ShellFlow;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
  }

  /**
   * params: {
   *             json: {
   *                 "app/ui-config.json": {
   *                     "txt2img/Sampling steps/value": 1,
   *                     "txt2img/CFG Scale/value": 1.0
   *                 }
   *             }
   *         }
   * @param params
   */
  async add(params: IShellAppRunParams) {
    for (let paramsKey in params.json) {
      const filepath = path.resolve(params.cwd!, paramsKey);

      if (filepath.endsWith('.json')) {
        let old = (await loader(filepath)).resolved;

        if (!old) {
          // 如果文件不存在，则创建文件夹
          old = {};
          const folder = path.dirname(filepath);

          await fs.promises.mkdir(folder, { recursive: true });
        }

        await fs.promises.writeFile(
          filepath,
          JSON.stringify({
            ...old,
            ...params.json[paramsKey],
          }),
        );
      }
    }
  }
}
