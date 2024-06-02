import { isWin32 } from '@beaver/arteffix-utils';
import { IRequirement } from '@beaver/types';
import { getShellFlow } from './get-shell-flow';

describe('bin 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('bin check requirement', async () => {
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

    if (isWin32) {
      requirements.push({
        name: 'registry',
      });
      requirements.push({
        name: 'vs',
      });
    }

    for (let i = 0; i < requirements.length; i++) {
      const requirement = requirements[i];
      requirement.installed = await shellFlow.bin.checkIsInstalled(
        requirement.name,
        requirement.type,
      );
    }

    console.log(requirements);
  });
});
