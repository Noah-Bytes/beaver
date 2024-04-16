import { fail, success } from '@beaver/utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../../beaver';

interface IAppStop {
  name: string;
}

export async function POST(request: Request) {
  const { name }: IAppStop = await request.json();

  try {
    await shellFlow?.app.stop(name);
    return NextResponse.json(success());
  } catch (e: any) {
    return NextResponse.json(fail(e.message));
  }
}
