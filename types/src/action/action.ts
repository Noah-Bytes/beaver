import { IJob } from './job';

export interface IAction {
  name?: string;
  status?: number;
  statTime?: number;
  path?: string
  endTime?: number;
  jobs: Record<string, IJob>;
}
