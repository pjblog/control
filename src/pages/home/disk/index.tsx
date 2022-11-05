import React, { useMemo } from 'react';
import { Card, Table } from 'antd';
import { useAsync } from '@codixjs/fetch';
import { getDiskInfo, TDiskState, useBaseRequestConfigs } from '../../../service';
import { ColumnsType } from 'antd/lib/table';
export function Disk() {
  const configs = useBaseRequestConfigs();
  const { data } = useAsync('diskinfo', () => getDiskInfo(configs));
  const columns = useMemo<ColumnsType<TDiskState>>(() => {
    return [
      {
        title: '#',
        width: 30,
        render(_: TDiskState,s: TDiskState, i: number) {
          return i + 1;
        }
      },
      {
        title: '磁盘名',
        dataIndex: 'Filesystem'
      },
      {
        title: '挂在路径',
        dataIndex: 'Mounted'
      },
      {
        title: '总量',
        dataIndex: 'Blocks'
      },
      {
        title: '使用量',
        dataIndex: 'Used'
      },
      {
        title: '可用量',
        dataIndex: 'Available'
      },
      {
        title: '使用率',
        dataIndex: 'Capacity'
      }
    ]
  }, [])
  return <Card title="磁盘数据">
    <Table columns={columns} dataSource={data} pagination={false} rowKey="Filesystem" />
  </Card>
}