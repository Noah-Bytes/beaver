import { fail, success } from '@beaver/utils';
import { NextRequest, NextResponse } from 'next/server';
import { shellFlow } from '../../../../../beaver';

export async function GET(request: NextRequest) {
  if (!shellFlow) {
    return NextResponse.json(fail('shellFlow not initialized'));
  }

  const name = request.nextUrl.searchParams.get('name');

  if (!name) {
    return NextResponse.json(fail(`parameter missing`));
  }

  const app = await shellFlow.app.getApp(name);
  if (app) {
    const logs = await app.logs();
    return NextResponse.json(success(logs));
  }
  return NextResponse.json(fail(`${name} is not exist`));
}
