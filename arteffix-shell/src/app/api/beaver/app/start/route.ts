import { fail, success } from '@beaver/utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../../beaver';

interface IAppStart {
  name: string;
}

export async function POST(request: Request) {
  const { name }: IAppStart = await request.json();

  try {
    await shellFlow?.app.start(name);
    return NextResponse.json(success());
  } catch (e: any) {
    return NextResponse.json(fail(e.message));
  }
}
