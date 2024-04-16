'use client';
import { constant } from '@beaver/utils';
import { useAsyncEffect } from 'ahooks';
import dayjs from 'dayjs';
import { ReadCommitResult } from 'isomorphic-git';
import { useState } from 'react';
import { IoGitPullRequestSharp } from 'react-icons/io5';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '../../../../components/material';
import { getAppLog } from '../../actions';
import { AppPageProps } from '../type';

export default async function AppLogsPage({ params: { name } }: AppPageProps) {
  const [logs, setLogs] = useState<ReadCommitResult[]>();

  useAsyncEffect(async () => {
    const resp = await getAppLog(name);
    if (resp.success) {
      setLogs(resp.data);
    }
  }, []);

  return (
    <Card className="">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              内核更新记录
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all members
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3" size="sm">
              <IoGitPullRequestSharp /> 更新
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto border-collapse border border-slate-400 text-left ">
          <thead>
            <tr>
              {['提交ID', '更新内容', '更新时间'].map((head) => (
                <th
                  key={head}
                  className="border-blue-gray-100 bg-blue-gray-50 border border-b border-slate-300 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(logs || []).map(({ oid, commit }, index) => (
              <tr key={oid} className="even:bg-blue-gray-50/50">
                <td className="border border-b border-slate-300 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {oid.slice(0, 5)}
                  </Typography>
                </td>
                <td className="border border-b border-slate-300 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="max-w-[800px] text-wrap font-normal"
                  >
                    {commit.message}
                  </Typography>
                </td>
                <td className="border border-b border-slate-300 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {dayjs(commit.committer.timestamp * 1000).format(
                      constant.YYYYMMDDhhmmss,
                    )}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
