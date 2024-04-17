export interface ILibraryResource {
  folders: Folder[]
  smartFolders: any[]
  quickAccess: any[]
  tagsGroups: TagsGroup[]
}

export interface ILibraryMeta {
  media: ILibraryResource,
  creativity: ILibraryResource,
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

export interface ILibrary {
  readonly version: string;
  readonly rootDir: string;
  meta: ILibraryMeta | undefined;

  init: () => Promise<void>;
}
