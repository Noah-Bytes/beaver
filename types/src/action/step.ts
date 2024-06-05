export interface IWithForGit {
  type: string;
  url?: string;
  dir?: string;
}

export interface IWithForShell {
  path?: string;
  run: string | string[];
}

export interface IWithForShellConda {
  venv?: string;
  path?: string;
  run: string | string[];
}

export interface IWthForDrive {
  uri?: string;
  ln: Record<string, string>;
  peers?: string[];
}

export interface IWthForDriveDownload {
  url: string;
  file: string;
  path: string;
}

export interface IWthForDriveFsCopy {
  type: 'copy';
  from: string;
  to: string;
  path: string;
}

export interface IWthForDriveFsRm {
  type: 'rm';
  file: string;
  path: string;
}

export interface IStep {
  name: string;
  uses?: string;
  run?: string;
  if?: string;
  with:
    | IWithForGit
    | IWithForShell
    | IWithForShellConda
    | IWthForDrive
    | IWthForDriveDownload
    | IWthForDriveFsCopy
    | IWthForDriveFsRm;
}
