import { fail, success } from '@beaver/arteffix-utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../beaver';

export async function GET() {
  if (!shellFlow) {
    return NextResponse.json(fail('shellFlow not initialized'));
  }

  const mates = shellFlow.shell.getMates();
  return NextResponse.json(success(mates));
}
