export interface IWithForGit {
  home?: string;
  type: string;
  url?: string;
  dir?: string;
}

export interface IWithForShell {
  home?: string;
  path?: string;
  args?: string[]
  run: string | string[];
}

export interface IWithForShellConda {
  venv?: string;
  path?: string;
  env?: string;
  envs?: Record<string, string>;
  home?: string;
  run: string | string[];
  sudo?: boolean;
}

export interface IWthForDrive {
  home?: string;
  uri?: string;
  ln: Record<string, string>;
  peers?: string[];
}

export interface IWthForDownload {
  home?: string;
  url: string;
  file: string;
  path: string;
}

export type IWthForFs =
  | IWthForFsCopy
  | IWthForFsRm
  | IWthForFsOutputFile
  | IWthForFsDecompress;

export interface IWthForFsCopy {
  home?: string;
  type: 'copy';
  from: string;
  to: string;
  path: string;
}

export interface IWthForFsRm {
  type: 'rm';
  home?: string;
  file?: string;
  path: string;
}

export interface IWthForFsOutputFile {
  type: 'outputFile';
  home?: string;
  file: string;
  path?: string;
  content: string;
}

export interface IWthForFsDecompress {
  home?: string;
  type: 'decompress';
  file: string;
  output: string;
  strip: number;
  path: string;
}

export type IStepWith =
  | IWithForGit
  | IWithForShell
  | IWithForShellConda
  | IWthForDrive
  | IWthForDownload
  | IWthForFsCopy
  | IWthForFsRm;

export interface IStep {
  name: string;
  uses?: string;
  run?: string;
  if?: string;
  with: IStepWith;
}
