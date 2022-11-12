import React, { useEffect, useMemo, useState } from 'react';
import { useSocket } from '../../components';
import styles from './index.module.less';
import { TBlogPackageState } from '../types';
import { Checkbox, Typography, Table, Tag, Space, Avatar } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useAsync } from '@codixjs/fetch';
import { getTheme, useBaseRequestConfigs } from '../../service';
import { Preview } from './preview';
import { Active } from './active';
import { UnInstall } from './uninstall';
import { CheckUpdate } from '../setting/update';

export default function ThemePage() {
  const socket = useSocket();
  const configs = useBaseRequestConfigs();
  const { data: theme, setData } = useAsync('theme', () => getTheme(configs));
  const [themes, setThemes] = useState<TBlogPackageState[]>([]);

  const columns = useMemo<ColumnsType<TBlogPackageState>>(() => {
    return [
      {
        title: '#',
        dataIndex: 'name',
        width: 30,
        render(_theme: string) {
          return _theme === theme ? <Checkbox checked={true} /> : null;
        }
      },
      {
        title: '封面',
        dataIndex: 'icon',
        width: 30,
        align: 'center',
        render(icon: string) {
          return <Avatar src={icon} size={36} shape="square" />
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 300,
        className: styles.name
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        render(version: string) {
          return <Tag>{version}</Tag>
        }
      },
      {
        title: '描述',
        dataIndex: 'description',
        className: styles.desc
      },
      {
        title: '操作',
        dataIndex: 'name',
        align: 'right',
        render(name: string, chunk: TBlogPackageState) {
          return <Space>
            {!!chunk.previews?.length && <Preview images={chunk.previews} />}
            {theme !== name && <Active name={name} reload={() => setData(name)} />}
            <CheckUpdate name={name} />
            {theme !== name && <UnInstall name={name} />}
          </Space>
        }
      }
    ]
  }, [theme, setData])

  useEffect(() => {
    if (socket) {
      const handler = (...themes: TBlogPackageState[]) => setThemes(themes);
      socket.on('themes', handler);
      socket.emit('themes');
      return () => {
        socket.off('themes', handler);
      }
    }
  }, [socket]);
  return <Table rowKey="name" pagination={false} dataSource={themes} columns={columns} />
}