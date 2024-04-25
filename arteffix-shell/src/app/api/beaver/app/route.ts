import { fail, success } from '@beaver/arteffix-utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../beaver';

export async function GET() {
  if (!shellFlow) {
    return NextResponse.json(fail('shellFlow not initialized'));
  }

  const apps = await shellFlow.app.getApps();
  const list = apps.map((elem) => elem.getMeta());
  return NextResponse.json(success(list));
}
