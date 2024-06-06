import { ShellConda } from '../src';

jest.setTimeout(1000000);
describe('exec', () => {
  it('conda list', async () => {
    const shell = new ShellConda({
      home: '/Users/taibai/Documents/我的智流.shell',
      run: 'conda list',
    });
    await shell.run();
  });

  it('ls -la', async () => {
    const shell = new ShellConda({
      home: '/Users/taibai/Documents/我的智流.shell',
      run: 'ls -la',
    });
    await shell.run();
  });

  it('install libarchive', async () => {
    const shell = new ShellConda({
      home: '/Users/taibai/Documents/我的智流.shell',
      run: ['conda install -c conda-forge libarchive'],
    });
    await shell.run();
  });
});
