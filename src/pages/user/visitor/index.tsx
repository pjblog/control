import { useRequestQuery } from '@codixjs/codix';
import { useAsync } from '@codixjs/fetch';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo } from 'react';
import { getVisitors, TVisitor, useBaseRequestConfigs } from '../../../service';
import { numberic } from '../../../utils';
import styles from './index.module.less';
import { Table } from 'antd';
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
        dataIndex: 'id'
      },
      {
        title: 'code',
        dataIndex: 'code',
      },
      {
        title: 'IP',
        dataIndex: 'ip'
      },
      {
        title: 'User Agent',
        dataIndex: 'user_agent'
      },
      {
        title: 'Time',
        dataIndex: 'gmt_create',
        render(time: string | Date) {
          return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
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