import { ShellFlow } from '../../src';

export function getShellFlow() {
  return new ShellFlow('Beaver', {
    isMirror: true,
    mirror: {
      'https://repo.anaconda.com/miniconda':
        'https://mirrors4.tuna.tsinghua.edu.cn/anaconda/miniconda',
      'https://github.com/indygreg/python-build-standalone/releases/download/20220802':
        'https://arteffix-github.oss-cn-hangzhou.aliyuncs.com/indygreg/python-build-standalone/releases/download/20220802',
      'https://github.com/pinokiocomputer/python':
        'https://gitee.com/arteffix/python',
      'https://nodejs.org/dist/v18.16.0':
        'https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v18.16.0',
      'https://github.com/ArtEffix': 'https://gitee.com/arteffix-launcher',
      'https://github.com/comfyanonymous': 'https://gitee.com/arteffix',
      'https://github.com/ltdrdata': 'https://gitee.com/arteffix',
      'https://huggingface.co': 'https://hf-mirror.com',
      'https://github.com/lllyasviel': 'https://gitee.com/arteffix',
      'https://github.com/cocktailpeanut/miniconda/releases/download':
        'https://arteffix-github.oss-cn-hangzhou.aliyuncs.com/miniconda/releases/download',
      'https://github.com/cocktailpeanut/bin/': 'https://arteffix-github.oss-cn-hangzhou.aliyuncs.com/cocktailpeanut/bin/'
    },
    homeDir: 'D:\\art.shell',
  });
}
