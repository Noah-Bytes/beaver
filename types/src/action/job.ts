import { IStep } from './step';

export interface IJob {
  global?: any;
  steps: IStep[];
}
