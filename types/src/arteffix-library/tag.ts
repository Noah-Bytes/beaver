import {IFileJson} from "./file-json";

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

export interface ITagGroup {
  id: string;
  name: string;
  createTime: number;
  updTime: number;
  icon?: string;
  children?: number[];
  description?: string;
}

export type ITagGroupUpdate = Partial<
  Pick<ITagGroup, 'name' | 'icon' | 'children' | 'description'>
>;

export interface ITag {
  tags: ITagMeta[];
  group: ITagGroup[];
}
