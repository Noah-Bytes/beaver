import { exec } from '../src';

describe('exec', () => {
  it('ls -la', async () => {
    const code = await exec('ls -la');
  });

  it('ping www.baidu.com', async () => {
    const code = await exec('ping www.baidu.com');
  });
});
