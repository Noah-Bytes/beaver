import { IJob } from './job';

export interface IAction {
  name?: string;
  jobs: Record<string, IJob>;
}
