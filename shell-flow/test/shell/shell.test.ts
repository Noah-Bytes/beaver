import { Shell } from '../../src/shell/shell';

describe('终端测试', () => {
  const shell = new Shell(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    'test',
  );
  const shell1 = new Shell(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    '并发',
  );
  const sync = new Shell(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    '同步',
  );

  jest.setTimeout(20000);

  beforeAll(() => {
    shell.init();
    shell1.init();
    sync.init();
  });

  afterAll(() => {
    shell.kill();
    shell1.kill();
    sync.kill();
  });

  it('控制台输入', () => {
    shell.send('ls', false);
    shell.send(' -lh', true);
    shell.send('pwd', true);
  });

  it('控制台并发', async () => {
    shell.send('pwd', true);

    shell1.send('ls', false);
    shell1.send(' -lh', true);
    shell1.send('pwd', true);
  });

  it('同步执行', async () => {
    let result = await sync.run({
      message: 'ls -lh',
    });
    console.log(result);
    result = await sync.run({
      message: 'ls -lh',
    });
    console.log(result);
    result = await sync.run({
      message: 'ls -lh',
    });
    console.log(result);
    result = await sync.run({
      message: 'ping -c 20 www.baidu.com',
    });
    console.log(result);

    try {
      result = await sync.run({
        message: 'paing -c 20 www.baidu.com',
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  });
});
