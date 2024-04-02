import { IPublicPluginConfig } from './plugin-config';

export type IPublicPluginCreator = (ctx: any) => IPublicPluginConfig;
