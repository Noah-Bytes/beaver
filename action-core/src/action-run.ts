import { actionParse, renderTemplate } from '@beaver/action-parse';
import { MetaFile } from '@beaver/kernel';
import { arch, getGpuInfo, platform } from '@beaver/system-info';
import { IAction, IStep, IStepWith } from '@beaver/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ActionUse } from './action-use';
import { Core } from './core';

enum ActionRunStatus {
  INIT,
  RUNNING,
  SUCCESS,
  FAIL,
  STOP,
  SKIP,
}

export async function parseData(yaml: string, home: string) {
  const action = actionParse(yaml);
  const [gpu] = await getGpuInfo();
  for (let jobsKey in action.jobs) {
    action.jobs[jobsKey] = JSON.parse(
      renderTemplate(JSON.stringify(action.jobs[jobsKey]), {
        global: action.jobs[jobsKey].global,
        os: {
          platform,
          arch,
          gpu,
        },
        absPath: (p: string) => path.resolve(home, p),
      }),
    );

    action.jobs[jobsKey].steps = action.jobs[jobsKey].steps
      .map((step: IStep) => {
        if (!step.uses) {
          step.uses = 'action/shell';

          if (step.run) {
            step.with = {
              ...(step.with || {}),
              // @ts-ignore
              run: step.run,
            };
          }
        }

        // 处理path
        if (action.path) {
          step.with.path = path.resolve(
            home,
            action.path,
            step.with.path || '',
          );
        }

        return step;
      })
      .filter((elem) => elem.if !== 'false');
  }

  return action;
}

export class ActionRun {
  status: number = ActionRunStatus.INIT;
  private yaml: IAction;
  private readonly _ctx: Core;
  private process?: ActionUse<IStepWith>;

  constructor(yaml: IAction, ctx: Core) {
    this.yaml = yaml;
    this._ctx = ctx;
  }

  isFinish() {
    if (
      [
        ActionRunStatus.FAIL,
        ActionRunStatus.SUCCESS,
        ActionRunStatus.STOP,
      ].includes(this.status)
    ) {
      return true;
    }

    let result = true;

    outerLoop: for (let jobsKey in this.yaml.jobs) {
      const job = this.yaml.jobs[jobsKey];
      for (let i = 0; i < job.steps.length; i++) {
        if (
          [ActionRunStatus.INIT, ActionRunStatus.RUNNING].includes(
            job.steps[i].status,
          ) ||
          job.steps[i].status === undefined
        ) {
          result = false;
          break outerLoop;
        }
      }
    }

    return result;
  }

  _start() {
    const { use } = this._ctx;
    return new Promise(async (resolve, reject) => {
      for (let jobsKey in this.yaml.jobs) {
        const job = this.yaml.jobs[jobsKey];

        for (let i = 0; i < job.steps.length; i++) {
          const step = job.steps[i];

          if (
            [ActionRunStatus.SUCCESS, ActionRunStatus.SKIP].includes(
              step.status,
            )
          ) {
            continue;
          }

          step.status = ActionRunStatus.RUNNING;

          if (this.status === ActionRunStatus.STOP) {
            step.status = ActionRunStatus.STOP;
            reject('');
          }

          step.startTime = Date.now();
          this.process = use.run(step.uses, step.with);
          if (step.async === false) {
            this.process
              .run()
              .then((result) => {
                step.result = result;
                step.status = ActionRunStatus.SUCCESS;
                step.endTime = Date.now();
                if (this.isFinish()) {
                  resolve('');
                }
              })
              .catch((e: any) => {
                step.result = e.message;
                step.status = ActionRunStatus.FAIL;
                step.endTime = Date.now();
                reject(e);
              });
            continue;
          }

          try {
            step.result = await this.process.run();
            step.status = ActionRunStatus.SUCCESS;
            step.endTime = Date.now();
            if (this.isFinish()) {
              resolve('');
            }
          } catch (e: any) {
            step.result = e.message;
            step.status = ActionRunStatus.FAIL;
            step.endTime = Date.now();
            reject(e);
          }
        }
      }
    });
  }

  async start() {
    this.status = ActionRunStatus.RUNNING;
    if (!this.yaml.statTime) {
      this.yaml.statTime = Date.now();
    }

    try {
      await this._start();
      this.status = ActionRunStatus.SUCCESS;
    } catch (e: any) {
      if (this.status !== ActionRunStatus.STOP) {
        this.status = ActionRunStatus.FAIL;
      }
    }
    this.yaml.endTime = Date.now();
    await this.saveData();
  }

  async stop() {
    this.status = ActionRunStatus.STOP;
    await this.process?.kill();
    await this.saveData();
  }

  async retry(): Promise<void> {
    for (let jobsKey in this.yaml.jobs) {
      const job = this.yaml.jobs[jobsKey];
      for (let i = 0; i < job.steps.length; i++) {
        if (job.steps[i].status === ActionRunStatus.FAIL) {
          job.steps[i].status = ActionRunStatus.INIT;
          break;
        }
      }
    }

    await this.start();
  }

  async jump(): Promise<void> {
    for (let jobsKey in this.yaml.jobs) {
      const job = this.yaml.jobs[jobsKey];
      for (let i = 0; i < job.steps.length; i++) {
        if (job.steps[i].status === ActionRunStatus.FAIL) {
          job.steps[i].status = ActionRunStatus.SKIP;
          break;
        }
      }
    }

    await this.start();
  }

  async saveData() {
    await fs.writeJson(
      path.resolve(
        this._ctx.options.homeDir,
        this.yaml.path,
        MetaFile.META_NAME,
      ),
      this.yaml,
    );
  }

  getAction() {
    this.yaml.status = this.status;
    return this.yaml;
  }
}

export class ActionRunManage {
  private useMap: Map<string, ActionRun> = new Map();
  private readonly _ctx: Core;

  constructor(ctx: Core) {
    this._ctx = ctx;
  }

  async create(yamlStr: string, name?: string) {
    const action = actionParse(yamlStr);
    if (this.useMap.has(action.name)) {
      throw new Error(`${action.name} had`);
    }

    const yaml = await parseData(yamlStr, this._ctx.options.homeDir);

    this.useMap.set(name || action.name, new ActionRun(yaml, this._ctx));

    return name || action.name;
  }

  async start(name: string) {
    if (this.useMap.has(name)) {
      await this.useMap.get(name).start();
    }
  }

  async stop(name: string) {
    if (this.useMap.has(name)) {
      await this.useMap.get(name).stop();
    }
  }

  async retry(name: string) {
    if (this.useMap.has(name)) {
      await this.useMap.get(name).retry();
    }
  }

  async jump(name: string) {
    if (this.useMap.has(name)) {
      await this.useMap.get(name).jump();
    }
  }

  get(name: string) {
    if (this.useMap.has(name)) {
      return this.useMap.get(name).getAction();
    }
    return undefined;
  }
}
