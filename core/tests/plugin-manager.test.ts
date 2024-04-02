import { Beaver } from '../src';
import { IPluginManager } from '../src/types/plugin-types';

describe('plugin 测试', () => {
  let pm: IPluginManager;
  beforeEach(() => {
    const beaver = new Beaver();
    pm = beaver.plugin.toProxy();
  });
  afterEach(() => {
    pm.destroy();
  });

  it('注册插件，插件参数生成函数能被调用，且能拿到正确的 ctx ', () => {
    const mockFn = jest.fn();
    const creator2 = (x: any) => {
      mockFn(x);
      return {
        init: jest.fn(),
      };
    };
    creator2.pluginName = 'demo1';
    pm.register(creator2);

    const [expectedCtx] = mockFn.mock.calls[0];
    expect(expectedCtx).toHaveProperty('project');
    expect(expectedCtx).toHaveProperty('setters');
    expect(expectedCtx).toHaveProperty('material');
    expect(expectedCtx).toHaveProperty('hotkey');
    expect(expectedCtx).toHaveProperty('plugins');
    expect(expectedCtx).toHaveProperty('skeleton');
    expect(expectedCtx).toHaveProperty('logger');
    expect(expectedCtx).toHaveProperty('config');
    expect(expectedCtx).toHaveProperty('event');
    expect(expectedCtx).toHaveProperty('preference');
  });

  it('注册插件，调用插件 init 方法', async () => {
    const mockFn = jest.fn();
    const creator2 = () => {
      return {
        init: mockFn,
        exports() {
          return {
            x: 1,
            y: 2,
          };
        },
      };
    };
    creator2.pluginName = 'demo1';

    pm.register(creator2);
    await pm.init();
    expect(pm.size).toBe(1);
    expect(pm.has('demo1')).toBeTruthy();
    expect(pm.get('demo1')!.isInit()).toBeTruthy();
    expect(pm.demo1).toBeTruthy();
    expect(pm.demo1.x).toBe(1);
    expect(pm.demo1.y).toBe(2);
    expect(pm.demo1.z).toBeUndefined();
    expect(mockFn).toHaveBeenCalled();
  });

  it('删除插件，调用插件 destroy 方法', async () => {
    const mockFn = jest.fn();
    const creator2 = () => {
      return {
        init: jest.fn(),
        destroy: mockFn,
      };
    };
    creator2.pluginName = 'demo1';
    pm.register(creator2);

    await pm.init();
    await pm.delete('demo1');
    expect(mockFn).toHaveBeenCalled();
    await pm.delete('non-existing');
  });

  describe('dependencies 依赖', () => {
    it('dependencies 依赖', async () => {
      const mockFn = jest.fn();
      const creator21 = () => {
        return {
          init: () => mockFn('demo1'),
        };
      };
      creator21.pluginName = 'demo1';
      creator21.meta = {
        dependencies: ['demo2'],
      };
      pm.register(creator21);
      const creator22 = () => {
        return {
          init: () => mockFn('demo2'),
        };
      };
      creator22.pluginName = 'demo2';
      pm.register(creator22);

      await pm.init();
      expect(mockFn).toHaveBeenNthCalledWith(1, 'demo2');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'demo1');
    });
  });

  it('autoInit 功能', async () => {
    const mockFn = jest.fn();
    const creator2 = () => {
      return {
        init: mockFn,
      };
    };
    creator2.pluginName = 'demo1';
    await pm.register(creator2, { autoInit: true });
    expect(mockFn).toHaveBeenCalled();
  });

  it('插件不会重复 init，除非强制重新 init', async () => {
    const mockFn = jest.fn();
    const creator2 = () => {
      return {
        name: 'demo1',
        init: mockFn,
      };
    };
    creator2.pluginName = 'demo1';
    pm.register(creator2);
    await pm.init();
    expect(mockFn).toHaveBeenCalledTimes(1);

    pm.get('demo1')!.init();
    expect(mockFn).toHaveBeenCalledTimes(1);

    pm.get('demo1')!.init(true);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('默认情况不允许重复注册', async () => {
    const mockFn = jest.fn();
    const mockPlugin = () => {
      return {
        init: mockFn,
      };
    };
    mockPlugin.pluginName = 'demoDuplicated';
    pm.register(mockPlugin);
    pm.register(mockPlugin).catch((e) => {
      expect(e).toEqual(new Error('Plugin with name demoDuplicated exists'));
    });
    await pm.init();
  });

  it('插件增加 override 参数时可以重复注册', async () => {
    const mockFn = jest.fn();
    const mockPlugin = () => {
      return {
        init: mockFn,
      };
    };
    mockPlugin.pluginName = 'demoOverride';
    pm.register(mockPlugin);
    pm.register(mockPlugin, { override: true });
    await pm.init();
  });

  it('插件增加 override 参数时可以重复注册, 被覆盖的如果已初始化，会被销毁', async () => {
    const mockInitFn = jest.fn();
    const mockDestroyFn = jest.fn();
    const mockPlugin = () => {
      return {
        init: mockInitFn,
        destroy: mockDestroyFn,
      };
    };
    mockPlugin.pluginName = 'demoOverride';
    await pm.register(mockPlugin, { autoInit: true });
    expect(mockInitFn).toHaveBeenCalledTimes(1);
    await pm.register(mockPlugin, { override: true });
    expect(mockDestroyFn).toHaveBeenCalledTimes(1);
    await pm.init();
  });

  it('getAll 方法', async () => {
    const creator2 = () => {
      return {};
    };
    creator2.pluginName = 'demo1';
    pm.register(creator2);
    await pm.init();

    expect(pm.getAll()).toHaveLength(1);
  });
});
