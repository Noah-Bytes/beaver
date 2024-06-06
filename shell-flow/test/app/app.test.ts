import { afterEach } from 'node:test';
import { getShellFlow } from '../bin/get-shell-flow';

describe('app 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  afterEach(async () => {
    await shellFlow.destroy();
  });

  it('git pull comfyui', async () => {
    await shellFlow.app.clone('https://github.com/ArtEffix/comfyui');
  });

  it('install app', async () => {
    const app = await shellFlow.app.getApp('comfyui');
    if (app) {
      await app.install();
    }
  });

  it('uninstall app', async () => {
    const app = await shellFlow.app.getApp('comfyui');
    if (app) {
      await app.unInstall();
    }
  });

  it('app gets', async () => {
    const apps = await shellFlow.app.getApps();
    console.log(apps);
  });

  it('app 启动', async () => {
    const app = await shellFlow.app.getApp('comfyui');
    if (app) {
      await app.start();
    }
  });
});
