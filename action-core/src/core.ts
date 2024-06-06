import { IStepWith } from '@beaver/types';
import { ActionUse, UseManage } from './action-use';

export class Core {
  private home: string;
  private use: UseManage;

  constructor(home: string) {
    this.use = new UseManage();
    this.home = home;
  }

  register(name: string, use: ActionUse<IStepWith>) {
    this.use.register(name, use);
  }
}
