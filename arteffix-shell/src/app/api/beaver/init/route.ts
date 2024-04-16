import path from 'path';
import { ShellFlowClass } from '@beaver/types';
import { fail, success } from '@beaver/utils';
import { NextResponse } from 'next/server';
import { initShellFlow } from '../../../../beaver';

export async function POST(request: Request) {
  const { homeDir }: ShellFlowClass = await request.json();

  if (!path.isAbsolute(homeDir)) {
    return NextResponse.json(fail('homeDir must be an absolute path'));
  }

  try {
    await initShellFlow(homeDir);
    return NextResponse.json(success());
  } catch (e: any) {
    return NextResponse.json(fail(e.message));
  }
}
