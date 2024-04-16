'use server';
import { IAppMeta } from '@beaver/shell-flow';
import { fail, success } from '@beaver/utils';
import { ReadCommitResult } from 'isomorphic-git';
import { shellFlow } from '../../beaver';

export async function getApps() {
  const apps = await shellFlow!.app.getApps();
  const list = apps.map((elem) => elem.getMeta());
  return success(list);
}

export async function getApp(name: string) {
  const app = await shellFlow!.app.getApp(name);
  if (app) {
    return success<IAppMeta>(app.getMeta());
  }

  return fail<IAppMeta>('not exist');
}

export async function getAppLog(name: string) {
  const app = await shellFlow!.app.getApp(name);
  if (app) {
    const logs = await app.logs();
    return success<ReadCommitResult[]>(logs);
  }

  return fail<ReadCommitResult[]>('not exist');
}
