import React, { useMemo } from 'react';
import styles from './index.module.less';
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
        align: 'center',
        className: styles.small,
        render(_: TDiskState,s: TDiskState, i: number) {
          return i + 1;
        }
      },
      {
        title: '磁盘名',
        dataIndex: 'Filesystem',
        className: styles.small,
      },
      {
        title: '挂载路径',
        dataIndex: 'Mounted',
        className: styles.small,
      },
      {
        title: '总量',
        dataIndex: 'Blocks',
        className: styles.small,
      },
      {
        title: '使用量',
        dataIndex: 'Used',
        className: styles.small,
      },
      {
        title: '可用量',
        dataIndex: 'Available',
        className: styles.small,
      },
      {
        title: '使用率',
        dataIndex: 'Capacity',
        className: styles.small,
      }
    ]
  }, [])
  return <Card title="磁盘数据" size="small" className={styles.table}>
    <Table 
      columns={columns} 
      dataSource={data.filter(d => d.Filesystem !== 'map')} 
      pagination={false} 
      rowKey="Filesystem" 
      size="middle" 
      style={{
        width: '100%',
      }}
    />
  </Card>
}