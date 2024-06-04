import { getShellFlow } from '../bin/get-shell-flow';
import {afterEach} from "node:test";

describe('app 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  afterEach(async () => {
    await shellFlow.destroy();
  })

  it('app gets', async () => {
    const apps = await shellFlow.app.getApps();
    console.log(apps)
  });

  it('app 启动', async () => {
    const app = await shellFlow.app.getApp('comfyui')
    if (app) {
      await app.start()
    }
  });
});
