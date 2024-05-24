export interface IShellAppMenu {
  icon: string;
  text: string;
  href: string;
}

export interface IShellAppMeta {
  title?: string;
  description?: string;
  icon?: string;

  install?: string;
  unInstall?: string;
  start?: string;
  update?: string;
  stop?: string;
}

export interface IShellAppRunParams {
  message: string | string[];
  json: {[key: string]: any}
  messageFn?: (data: {
    gpu?: string;
    platform: string;
    mirror?: boolean;
  }) => string | string[];
  on?: {
    event: string
  }[]
  path?: string;
  venv?: string;
  cmd?: string; // 执行命令
  cwd?: string; // 当前路径
  git?: string; // 项目远程地址
  url?: string;
  env?: { [key: string]: string };
  drive?: { [key: string]: string | string[] };
  peers?: string[];
  dir?: string;
}

export interface IShellAppRun {
  method: string;
  params: IShellAppRunParams;
}

export interface IShellAppRequires {
  name: string | string[];
  type?: string;
  args?: string;
  platform?: string | string[];
  arch?: string;
  gpu?: string;
}

export interface IShellApp {
  run: IShellAppRun[];
  requires: IShellAppRequires[];
}


export interface IRequirement extends IShellAppRequires {
  installed?: boolean
}
