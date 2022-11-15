import React, { useEffect, useMemo, useState } from 'react';
import { useSocket } from '../../components';
import styles from './index.module.less';
import { TBlogPackageState } from '../types';
import { Table, Tag, Space, Avatar, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UnInstall } from './uninstall';
import { CheckUpdate } from '../setting/update';
import { usePath } from '../../hooks';

export default function PluginPage() {
  const socket = useSocket();
  const [plugins, setPlugins] = useState<TBlogPackageState[]>([]);
  const pluginDetail = usePath('PLUGIN_DETAIL');
  const columns = useMemo<ColumnsType<TBlogPackageState>>(() => {
    return [
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
        render(name: string) {
          return <Space>
            <CheckUpdate name={name} />
            <UnInstall name={name} />
            <Typography.Link onClick={() => pluginDetail.redirect({ plugin: name })}>详细</Typography.Link>
          </Space>
        }
      }
    ]
  }, [plugins])

  useEffect(() => {
    if (socket) {
      const handler = (...themes: TBlogPackageState[]) => setPlugins(themes);
      socket.on('plugins', handler);
      socket.emit('plugins');
      return () => {
        socket.off('themes', handler);
      }
    }
  }, [socket]);
  return <Table rowKey="name" pagination={false} dataSource={plugins} columns={columns} />
}