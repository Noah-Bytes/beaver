'use client';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
import { VscFolder } from 'react-icons/vsc';
import { IAppMeta } from '../../../../../shell-flow/src/types/app-types';
import { getApps } from '../actions';

export default async function AppListPage() {
  const [list, setList] = useState<IAppMeta[]>();

  useAsyncEffect(async () => {
    const resp = await getApps();
    if (resp.success) {
      setList(resp.data);
    }
  }, []);

  return (
    <ul className="list-none space-y-4 p-4">
      {(list || []).map((elem) => (
        <li
          key={elem.name}
          className="flex cursor-pointer items-center justify-between gap-4 p-2 hover:bg-gray-800"
        >
          <a href={`/app/${elem.name}`} className="flex w-2/3 gap-4">
            <img
              className="h-[80px] w-[80px] rounded"
              src={elem.icon}
              alt={elem.title || ''}
            />
            <div className="flex flex-col justify-between">
              <span className="flex items-center gap-2 text-xs">
                <VscFolder className="inline" /> {elem.dir}
              </span>
              <h2 className="text-lg font-bold">{elem.title}</h2>
              <p className="text-xs">{elem.description}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
