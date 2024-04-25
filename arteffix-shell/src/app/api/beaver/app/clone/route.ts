import { fail, success } from '@beaver/arteffix-utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../../beaver';

interface IAppClone {
  url: string;
}

export async function POST(request: Request) {
  const { url }: IAppClone = await request.json();

  try {
    await shellFlow?.app.clone(url);
    return NextResponse.json(success(undefined));
  } catch (e: any) {
    return NextResponse.json(fail(e.message));
  }
}
