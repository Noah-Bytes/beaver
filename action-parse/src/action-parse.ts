import { IAction } from '@beaver/types';
import { parse } from 'yaml';

export function actionParse(content: string): IAction {
  return parse(content) as IAction;
}
