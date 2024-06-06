const MIRROR_CONFIG: Record<string, string> = {
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
  'https://github.com/cocktailpeanut/bin/':
    'https://arteffix-github.oss-cn-hangzhou.aliyuncs.com/cocktailpeanut/bin/',
  'https://download.pytorch.org/whl/cu121':
    'https://pypi.tuna.tsinghua.edu.cn/simple',
  'https://download.pytorch.org/whl/nightly/cpu':
    'https://pypi.tuna.tsinghua.edu.cn/simple',
  'https://download.pytorch.org/whl/rocm5.7':
    'https://pypi.tuna.tsinghua.edu.cn/simple',
  'https://download.pytorch.org/whl/cpu':
    'https://pypi.tuna.tsinghua.edu.cn/simple',
};

export function mirror(str: string) {
  for (let mirrorKey in MIRROR_CONFIG) {
    if (str.includes(mirrorKey)) {
      str = str.replace(new RegExp(mirrorKey, 'gm'), MIRROR_CONFIG[mirrorKey]);
    }
  }

  return str;
}
