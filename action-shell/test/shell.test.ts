import { ActionShell } from '../src';

describe('exec', () => {
  it('ls -la', async () => {
    const shell = new ActionShell({
      run: 'ls -la',
    });
    await shell.run();
  });

  it('ping www.baidu.com', async () => {
    const shell = new ActionShell({
      run: 'ping www.baidu.com',
    });
    await shell.run();
  });
});
