export interface IPublicPluginConfig {
  init(): Promise<void> | void;
  destroy?(): Promise<void> | void;
  exports?(): any;
}
