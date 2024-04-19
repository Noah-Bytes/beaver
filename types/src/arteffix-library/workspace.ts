export interface IWorkspaceResource {
  folders: Folder[]
  smartFolders: any[]
  quickAccess: any[]
  tagsGroups: TagsGroup[]
}

export interface IWorkspaceMeta {
  media: IWorkspaceResource,
  creativity: IWorkspaceResource,
  modificationTime: number
  applicationVersion: string
}

export interface Folder {
  id: string
  name: string
  description: string
  children: Children[]
  modificationTime: number
  tags: any[]
  password: string
  passwordTips: string
  coverId?: string
  orderBy?: string
  sortIncrease?: boolean
}

export interface Children {
  id: string
  name: string
  description: string
  children: any[]
  modificationTime: number
  tags: any[]
  password: string
  passwordTips: string
}

export interface TagsGroup {
  id: string
  name: string
  tags: string[]
}

export interface IWorkspace {
  readonly rootDir: string;
  meta: IWorkspaceMeta | undefined;

  init: () => Promise<void>;

  destroy: () => Promise<void>;

  createMetadata: () => Promise<void>;

  absPath: (...p: string[]) => string;
}
