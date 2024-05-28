import { uuid } from '@beaver/arteffix-utils';
import {
  ITag,
  ITagGroup,
  ITagGroupCreate,
  ITagGroupUpdate,
  ITagImpl,
  ITagMeta,
  ITagMetaCreate, ITagMetaUpdate,
} from '@beaver/types';
import { FileJson } from './file-json';

export class Tag extends FileJson<ITag> implements ITagImpl {
  constructor(rootDir: string) {
    super(rootDir, 'tag.json', {
      tags: [],
      group: [],
    });
  }

  createGroup(group: ITagGroupCreate): ITagGroup {
    const now = Date.now();
    return {
      children: [],
      createTime: now,
      description: group.description,
      icon: group.icon,
      id: uuid('tag_g'),
      name: group.name,
      updTime: now,
    };
  }

  createTag(tag: ITagMetaCreate): ITagMeta {
    const now = Date.now();
    return {
      createTime: now,
      description: tag.description,
      icon: tag.icon,
      id: uuid('tag'),
      name: tag.name,
      updTime: now,
    };
  }

  async updateGroup(groupId: string, group: ITagGroupUpdate): Promise<void> {
    this.json.group = this.json.group.map((elem) => {
      if (elem.id === groupId) {
        return {
          ...elem,
          ...group,
        };
      }

      return elem;
    });

    await this.save();
  }

  async updateTag(tagId: string, tag: ITagMetaUpdate): Promise<void> {
    this.json.tags = this.json.tags.map((elem) => {
      if (elem.id === tagId) {
        return {
          ...elem,
          ...tag,
        };
      }

      return elem;
    });

    await this.save();
  }

  async addGroup(group: ITagGroupCreate): Promise<ITagGroup> {
    const ng = this.createGroup(group);
    this.json.group.push(ng);

    await this.save();

    return ng;
  }

  async addTag(
    tag: ITagMetaCreate,
    groupId: string | undefined,
  ): Promise<ITagMeta> {
    const nt = this.createTag(tag);
    this.json.tags.push(nt);
    if (groupId) {
      const targetGroup = this.json.group.find((elem) => elem.id === groupId);
      if (targetGroup) {
        targetGroup.children.push(nt.id);
      }
    }
    await this.save();
    return nt;
  }

  async removeGroup(groupId: string): Promise<void> {
    this.json.group = this.json.group.filter((elem) => elem.id !== groupId);
    await this.save();
  }

  async removeTag(tagId: string): Promise<void> {
    this.json.tags = this.json.tags.filter((elem) => elem.id !== tagId);
    this.json.group = this.json.group.map((g) => {
      if (g.children.includes(tagId)) {
        return {
          ...g,
          children: g.children.filter((c) => c !== tagId),
        };
      }

      return g;
    });
    await this.save();
  }

  async removeTagFromGroup(tagId: string, groupId: string): Promise<void> {
    // tag 可以在多个分组中
    this.json.group = this.json.group.map((g) => {
      if (g.children.includes(tagId)) {
        return {
          ...g,
          children: g.children.filter((c) => c !== tagId),
        };
      }

      return g;
    });
    await this.save();
  }

  async tagAddGroup(tagId: string, groupId: string): Promise<void> {
    const targetGroup = this.json.group.find((elem) => elem.id === groupId);
    if (targetGroup) {
      targetGroup.children.push(tagId);
    }
    await this.save();
  }
}
