'use client';
import { IAppMeta } from '@beaver/shell-flow';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
import { getApp } from '../actions';
import { AppPageProps } from './type';

export default async function AppPage({ params: { name } }: AppPageProps) {
  const [app, setApp] = useState<IAppMeta>();

  useAsyncEffect(async () => {
    const resp = await getApp(name);
    if (resp.success && resp.data) {
      return setApp(resp.data);
    }
  }, []);

  return (
    <div className="container flex flex-row">
      <div className="w-[200px]">
        <div className="text-center">
          <img
            src={app?.icon}
            className="inline h-[100px] w-[100px]"
            alt={app?.name}
          />
          <h2 className="text-base font-medium">{app?.title}</h2>
        </div>
        <ul>
          <li>文件</li>
          <li>安装</li>
          <li>更新</li>
        </ul>
      </div>
    </div>
  );
}
