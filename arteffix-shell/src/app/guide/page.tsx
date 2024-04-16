'use client';

import { ShellFlowClass } from '@beaver/types';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useAsyncEffect } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import store from 'store';
import { Button, Card, Input, Typography } from '../../components/material';
import { ToastAction } from '../../components/shadcn/toast/toast';
import { useToast } from '../../components/shadcn/toast/use-toast';
import { getPlatform, init } from './actions';

const resolver = classValidatorResolver(ShellFlowClass);
const SHELL_FLOW_CONFIG = 'SHELL_FLOW_CONFIG';

interface InitPageProps {}

export default function InitPage({}: InitPageProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShellFlowClass>({
    resolver,
    defaultValues: store.get(SHELL_FLOW_CONFIG),
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<NodeJS.Platform>();

  useAsyncEffect(async () => {
    const p = await getPlatform();
    setPlatform(p.data);
  }, []);

  async function handleOnSummit(data: ShellFlowClass) {
    setLoading(true);

    const resp = await init(data.homeDir);

    if (resp.success) {
      store.set(SHELL_FLOW_CONFIG, data);
      router.push('/guide/require');
    } else {
      toast({
        variant: 'destructive',
        title: '初始化失败',
        description: resp.subMsg,
        action: <ToastAction altText="more">详情</ToastAction>,
      });
    }
    setLoading(false);
  }

  return (
    <Card className="p-8">
      <Typography variant="h4" color="blue-gray" className="text-center">
        ArtEffix 本地启动器
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-center">
        启动器需要初始化一些数据
      </Typography>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit(handleOnSummit)}
      >
        <div className="mb-1">
          <Input
            disabled={loading}
            crossOrigin="true"
            label="本地存储目录"
            size="lg"
            placeholder={
              platform === 'win32' ? 'D:/beaver' : '/Users/用户名/beaver'
            }
            {...register('homeDir')}
            error={!!errors.homeDir}
          />
          {errors.homeDir && (
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.homeDir.message}
            </Typography>
          )}
        </div>
        <Button
          type="submit"
          className="mt-6 justify-center"
          loading={loading}
          fullWidth
        >
          下一步
        </Button>
      </form>
    </Card>
  );
}
