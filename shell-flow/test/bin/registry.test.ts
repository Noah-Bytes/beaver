import { shellEnvSync } from 'shell-env'

describe('registry 测试', () => {
  it('registry 是否安装', async () => {
    console.log(shellEnvSync())
  });
});
