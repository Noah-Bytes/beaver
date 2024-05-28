import { IFileJson } from './file-json';

export interface ITagMeta {
  id: string;
  name: string;
  createTime: number;
  updTime: number;
  icon?: string;
  description?: string;
}

export type ITagMetaUpdate = Partial<
  Pick<ITagMeta, 'name' | 'icon' | 'description'>
>;

export type ITagMetaCreate = Pick<ITagMeta, 'name'> & ITagMetaUpdate;

export interface ITagGroup {
  id: string;
  name: string;
  createTime: number;
  updTime: number;
  icon?: string;
  children: string[];
  description?: string;
}

export type ITagGroupUpdate = Partial<
  Pick<ITagGroup, 'name' | 'icon' | 'children' | 'description'>
>;

export type ITagGroupCreate = Pick<ITagGroup, 'name'> & ITagGroupUpdate;

export interface ITag {
  tags: ITagMeta[];
  group: ITagGroup[];
}

export interface ITagImpl extends IFileJson<ITag> {
  addTag: (tag: ITagMetaCreate, groupId?: string) => Promise<ITagMeta>;
  createTag: (tag: ITagMetaCreate) => ITagMeta;
  updateTag: (tagId: string, tag: ITagMetaUpdate) => Promise<void>;
  removeTag: (tagId: string) => Promise<void>;
  addGroup: (group: ITagGroupCreate) => Promise<ITagGroup>;
  createGroup: (group: ITagGroupCreate) => ITagGroup;
  updateGroup: (groupId: string, group: ITagGroupUpdate) => Promise<void>;
  removeGroup: (groupId: string) => Promise<void>;
  tagAddGroup: (tagId: string, groupId: string) => Promise<void>;
  removeTagFromGroup: (tagId: string, groupId: string) => Promise<void>;
}
