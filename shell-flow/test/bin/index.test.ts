import { ShellFlow } from '../../src';

jest.setTimeout(100000);

describe('bin 测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('bin download', async () => {
    // await shellFlow.bin.wget(
    //   'https://repo.anaconda.com/miniconda/Miniconda3-py310_23.5.2-0-MacOSX-x86_64.sh',
    //   'Miniconda3-py310_23.5.2-0-MacOSX-arm64.sh',
    // );
    await shellFlow.bin.download(
      'https://repo.anaconda.com/miniconda/Miniconda3-py310_23.5.2-0-MacOSX-x86_64.sh',
      'Miniconda3-py310_23.5.2-0-MacOSX-arm64.sh',
    );
    await shellFlow.bin.download(
      'https://repo.anaconda.com/miniconda/Miniconda3-py310_23.5.2-0-MacOSX-arm64.sh',
      'Miniconda3-py310_23.5.2-0-MacOSX-x86_64.sh',
    );
  });
});
