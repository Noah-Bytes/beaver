import { fail, success } from '@beaver/utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../../beaver';

interface IAppInstall {
  name: string;
}

export async function POST(request: Request) {
  const { name }: IAppInstall = await request.json();

  try {
    await shellFlow?.app.install(name);
    return NextResponse.json(success());
  } catch (e: any) {
    return NextResponse.json(fail(e.message));
  }
}
