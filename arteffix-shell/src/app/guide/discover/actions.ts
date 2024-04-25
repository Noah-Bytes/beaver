'use server';

import { fail, success } from '@beaver/arteffix-utils';
import {shellFlow} from "../../../beaver";

export async function explore() {
  const exploreResp = await fetch('http://localhost:3002/api/mode/explore');
  const list = await exploreResp.json();
  return success(list);
}

export async function gitClone(remoteUrl: string) {
  try {
    await shellFlow!.app.clone(remoteUrl);
    return success(undefined);
  } catch (e: any) {
    return fail(e.message);
  }
}
