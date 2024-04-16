'use client';

import { useAsyncEffect } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DefaultSkeleton } from '../../../components/default-skeleton';
import { Button, Card, Typography } from '../../../components/material';
import {
  IRequirement,
  getRequirements,
  installByRequirements,
} from '../actions';

export default function RequirePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IRequirement[]>();
  const [needInstall, setNeedInstall] = useState(true);

  useAsyncEffect(async () => {
    const resp = await getRequirements();
    setList(resp.data?.requirements);
    setNeedInstall(!!resp.data?.needInstall);
  }, []);

  async function handleOnClick() {
    if (!list || list.length === 0) {
      return;
    }
    setLoading(true);
    const resp = await installByRequirements(list);
    if (resp.success) {
    }
    setLoading(false);
  }

  return (
    <Card className="p-8 w-[480px]">
      <Typography variant="h4" color="blue-gray" className="text-center">
        依赖安装
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-center">
        运行环境需要安装一些依赖环境
      </Typography>
      <div className="mt-8">
        {list ? (
          <ul>
            {(list || []).map((elem, index) => (
              <li key={index}>
                {Array.isArray(elem.name) ? elem.name.join(',') : elem.name}
                {elem.installed ? '已安装' : '未安装'}
              </li>
            ))}
          </ul>
        ) : (
          <DefaultSkeleton />
        )}
      </div>
      {needInstall ? (
        <Button
          type="submit"
          disabled={loading}
          className="mt-6 justify-center"
          loading={loading}
          fullWidth
          onClick={handleOnClick}
        >
          {loading ? '安装中...' : '一键安装'}
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={loading}
          className="mt-6 justify-center"
          loading={loading}
          fullWidth
          onClick={() => {
            router.push('/guide/discover');
          }}
        >
          下一步
        </Button>
      )}
    </Card>
  );
}
