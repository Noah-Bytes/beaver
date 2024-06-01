import { IRequirement } from '@beaver/types';
import { isWin32 } from '@beaver/arteffix-utils'
import { ShellFlow } from '../../src';

jest
  .mock('shell-env', () => ({
    shellEnvSync: jest.fn(() => ({
      PATH: '/mock/path',
      HOME: '/mock/home',
    })),
  }))
  .mock('strip-ansi', () => {
    return (data: string) => {
      return data;
    };
  });
jest.setTimeout(100000);

describe('bin 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: '/Users/taibai/workspace/beaver/beaver',
  });

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
        name: 'registry'
      })
      requirements.push({
        name: 'vs'
      })
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
