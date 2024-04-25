'use server';

import { fail, isWin32, success } from '@beaver/arteffix-utils';
import { IShellAppRequires } from '@beaver/types';
import * as os from 'os';
import path from 'path';
import { initShellFlow, shellFlow } from '../../beaver';

export async function getPlatform() {
  return success(os.platform());
}

export async function init(homeDir: string) {
  if (path.isAbsolute(homeDir)) {
    try {
      await initShellFlow(homeDir);
      return success(undefined);
    } catch (e: any) {
      return fail(e.message);
    }
  }

  return fail('homeDir must be an absolute path');
}

export interface IRequirement extends IShellAppRequires {
  installed?: boolean;
}

export async function getRequirements() {
  const requirements: IRequirement[] = [
    {
      name: 'conda',
    },
    {
      name: 'git',
    },
    {
      name: 'zip',
    },
    {
      type: 'conda',
      name: ['nodejs', 'ffmpeg'],
      args: '-c conda-forge',
    },
    {
      name: 'py',
    },
  ];
  if (isWin32()) {
    requirements.push({
      name: 'registry',
    });
    requirements.push({
      name: 'vs',
    });
  }

  let needInstall = false;

  for (let i = 0; i < requirements.length; i++) {
    const requirement = requirements[i];
    requirement.installed = await shellFlow!.bin.checkIsInstalled(
      requirement.name,
      requirement.type,
    );
    if (!requirement.installed) {
      needInstall = true;
    }
  }

  return success({
    requirements,
    needInstall,
  });
}

export async function installByRequirements(requirements: IRequirement[]) {
  const rs = requirements
    .filter((elem) => elem.installed === false)
    .map((elem) => ({
      name: elem.name,
      type: elem.type,
      args: elem.args,
    }));
  try {
    await shellFlow!.bin.install(rs);
    return success(undefined);
  } catch (e: any) {
    return fail(e.message);
  }
}
