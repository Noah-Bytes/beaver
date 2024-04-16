'use client';

import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
import { DefaultSkeleton } from '../../../components/default-skeleton';
import { Button, Card, Typography } from '../../../components/material';
import { ToastAction } from '../../../components/shadcn/toast/toast';
import { useToast } from '../../../components/shadcn/toast/use-toast';
import { cn } from '../../../lib/utils';
import { explore, gitClone } from './actions';

export default function DiscoverPage() {
  const { toast } = useToast();
  const [init, setInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [select, setSelect] = useState<string>();

  useAsyncEffect(async () => {
    const resp = await explore();
    setList(resp.data);
    setInit(false);
  }, []);

  async function handleOnClick() {
    setLoading(true);
    if (select) {
      const resp = await gitClone(select);

      if (resp.success) {
      } else {
        toast({
          variant: 'destructive',
          title: '拉取失败',
          description: resp.subMsg,
          action: <ToastAction altText="more">详情</ToastAction>,
        });
      }
    }
    setLoading(false);
  }

  return (
    <Card className="p-8 w-[900px]">
      <Typography variant="h4" color="blue-gray" className="text-center">
        选择GUI
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-center">
        操作界面ui
      </Typography>
      <div className="mt-8">
        {init ? (
          <DefaultSkeleton />
        ) : (
          <ul className="flex col-span-2 gap-4">
            {list.map((item: any) => (
              <li
                key={item.title}
                className={cn(
                  'flex-1 space-y-1 p-4 cursor-pointer hover:bg-gray-300',
                  {
                    'bg-gray-200': select === item.git,
                  },
                )}
                onClick={() => {
                  setSelect(item.git);
                }}
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm">{item.description}</p>
                <p>{item.git}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button
        type="submit"
        disabled={!select || loading}
        className="mt-6 justify-center"
        loading={loading}
        fullWidth
        onClick={handleOnClick}
      >
        {loading ? '拉取中...' : '下一步'}
      </Button>
    </Card>
  );
}
