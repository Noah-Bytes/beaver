import { fail, isWin32, success } from '@beaver/utils';
import { NextResponse } from 'next/server';
import { shellFlow } from '../../../../beaver';
import { IRequirement } from '../../../guide/actions';

export async function GET() {
  if (!shellFlow) {
    return NextResponse.json(fail('shellFlow not initialized'));
  }

  const requirements: IRequirement[] = [
    {
      name: 'conda',
    },
    {
      name: 'git',
    },
    {
      name: 'zip',
    },
    {
      type: 'conda',
      name: ['nodejs', 'ffmpeg'],
      args: '-c conda-forge',
    },
    {
      name: 'py',
    },
  ];
  if (isWin32()) {
    requirements.push({
      name: 'registry',
    });
    requirements.push({
      name: 'vs',
    });
  }

  for (let i = 0; i < requirements.length; i++) {
    const requirement = requirements[i];
    requirement.installed = await shellFlow!.bin.checkIsInstalled(
      requirement.name,
      requirement.type,
    );
  }

  return NextResponse.json(success(requirements));
}

export async function POST(request: Request) {
  const {
    requirements,
  }: {
    requirements: IRequirement[];
  } = await request.json();

  const rs = requirements
    .filter((elem) => elem.installed === false)
    .map((elem) => ({
      name: elem.name,
      type: elem.type,
      args: elem.args,
    }));
  try {
    await shellFlow!.bin.install(rs);
    return NextResponse.json(success());
  } catch (e: any) {
    return NextResponse.json(fail(e.message));
  }
}
