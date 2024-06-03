import {getShellFlow} from "./get-shell-flow";
import {afterEach} from "node:test";

jest.setTimeout(1000000);

describe('zip 测试', () => {
  const shellFlow = getShellFlow()

  beforeAll(async () => {
    await shellFlow.init();
  });

  afterEach(async () => {
    await shellFlow.destroy();
  })

  it('zip 安装', async () => {
    const zip = shellFlow.bin.getModule('zip')
    if (zip) {
      await zip.install()
    }
  });

  it('zip 是否安装', async () => {
    const zip = shellFlow.bin.getModule('zip')
    if (zip) {
      const result = await zip.installed()
      console.log(result)
    }
  })

  it('zip 卸载', async () => {
    const zip = shellFlow.bin.getModule('zip')
    if (zip) {
      await zip.uninstall()
    }
  })
});
