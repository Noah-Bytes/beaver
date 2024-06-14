import * as fs from 'fs';
import * as path from 'path';
import { Core } from '../src/core';

describe('exec', () => {
  const core = new Core('beaver', {
    homeDir: '/Users/taibai/Documents/art.shell',
  });

  beforeAll(async () => {});

  it('environment install', async () => {
    const context = fs.readFileSync(
      path.join(__dirname, '../data/environment.yaml'),
      'utf8',
    );

    try {
      const name = await core.run(context);
      console.log(JSON.stringify(core.getRun(name)));
    } catch (e) {
      console.log(e);
    }
  });

  it('comfyui install', async () => {
    const context = fs.readFileSync(
      path.join(__dirname, '../data/install.yaml'),
      'utf8',
    );

    try {
      const name = await core.run(context);
      console.log(JSON.stringify(core.getRun(name)));
    } catch (e) {
      console.log(e);
    }
  });
});
