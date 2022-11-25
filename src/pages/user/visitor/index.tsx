import { useRequestQuery } from '@codixjs/codix';
import { useAsync } from '@codixjs/fetch';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo } from 'react';
import { getVisitors, TVisitor, useBaseRequestConfigs } from '../../../service';
import { numberic } from '../../../utils';
import styles from './index.module.less';
import { Table, Typography } from 'antd';
import { usePath } from '../../../hooks';
import dayjs from 'dayjs';

export default function Visitor() {
  const VISITOR = usePath('VISITOR');
  const configs = useBaseRequestConfigs();
  const page = useRequestQuery('page', numberic(1)) as number;
  const size = useRequestQuery('size', numberic(20)) as number;
  const { data } = useAsync('visitor:' + page + ':' + size, () => getVisitors(configs), [page, size]);
  const columns = useMemo<ColumnsType<TVisitor>>(() => {
    return [
      {
        title: '#',
        dataIndex: 'id',
        width: 50,
      },
      {
        title: 'code',
        dataIndex: 'code',
        width: 350,
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        width: 200,
      },
      {
        title: 'User Agent',
        dataIndex: 'user_agent',
        ellipsis: true
      },
      {
        title: 'Time',
        dataIndex: 'gmt_create',
        width: 200,
        render(time: string | Date) {
          return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      {
        title: null,
        dataIndex: 'ip',
        width: 80,
        align: 'center',
        render(ip: string) {
          const exec = /^\:\:\w+\:(\d+\.\d+\.\d+.\d+)$/.exec(ip);
          const _ip = exec ? exec[1] : ip;
          const url = `https://ip138.com/iplookup.asp?ip=${_ip}&action=2`;
          return <Typography.Link href={url} target="_blank">查询</Typography.Link>
        }
      }
    ]
  }, [])
  return <Table rowKey="id" dataSource={data.list} columns={columns} pagination={{
    current: page,
    pageSize: size,
    total: data.total,
    onChange(a, b) {
      VISITOR.redirect({}, {
        page: a + '',
        size: b + '',
      })
    }
  }} />
}