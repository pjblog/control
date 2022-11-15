import React, { useCallback, useMemo, useState } from 'react';
import styles from './index.module.less';
import { EditableTable, TGetColumns } from '../../components';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { FilterOutlined } from '@ant-design/icons';
import { Col, message, Row, Typography, Popconfirm, Space, Radio, Input } from 'antd';
import { getLinks, useBaseRequestConfigs, TLinkState, createNewLinkState, addLink, updateLink, deleteLink, updateLinkStatus } from '../../service';

export default function LinkPage() {
  const configs = useBaseRequestConfigs();
  const [status, setStatus] = useState<-1 | 0 | 1>(0)
  const { data, execute, loading } = useAsync('links', () => getLinks(configs));
  const ADD = useAsyncCallback(addLink);
  const UPDATE = useAsyncCallback(updateLink);
  const DELETE = useAsyncCallback(deleteLink);
  const STATUS = useAsyncCallback(updateLinkStatus);

  // 删除
  const delit = useCallback((id: number, remove: Function) => {
    if (id === 0) return remove(0);
    DELETE.execute(id)
      .then(execute)
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message));
  }, [data, DELETE.execute]);

  // 改状态
  const changeStatus = useCallback((id: number, status: boolean) => {
    if (id === 0) return;
    STATUS.execute(id, status)
      .then(execute)
      .then(() => message.success('更新状态成功'))
      .catch(e => message.error(e.message));
  }, [execute])

  // 更新 / 新增
  const post = useCallback((r: TLinkState) => {
    const promise = !r.id
      ? ADD.execute({
          name: r.link_name,
          icon: r.link_icon,
          url: r.link_url,
        })
      : UPDATE.execute(r.id, {
          name: r.link_name,
          icon: r.link_icon,
          url: r.link_url,
        })
    promise
      .then(execute)
      .then(() => message.success(!r.id ? '新增成功' : '更新成功'))
      .catch(e => message.error(e.message))
  }, [execute])

  const getColums: TGetColumns<TLinkState> = useCallback((Actions, remove) => {
    return [
      {
        title: '#',
        dataIndex: 'id',
        width: 30,
        className: styles.gray
      },
      {
        title: 'ICON',
        dataIndex: 'link_icon',
        editable: () => true,
        edittype: () => <Input placeholder="请输入ICON地址" />,
        width: 100,
        align: 'center',
        render(url: string) {
          return <img src={url} alt="" className={styles.link_icon} />
        }
      },
      {
        title: '站点名',
        dataIndex: 'link_name',
        editable: () => true,
        edittype: () => <Input placeholder="请输入站点名" />,
        width: 200,
      },
      {
        title: '站点地址',
        dataIndex: 'link_url',
        editable: () => true,
        edittype: () => <Input placeholder="请输入站点地址" />,
        render(url: string) {
          return <Typography.Link href={url} target="_blank">{url}</Typography.Link>
        }
      },
      {
        title: '状态',
        dataIndex: 'link_status',
        width: 80,
        render(s: boolean) {
          return s ? '通过' : '待审核'
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 200,
        render(_: number, s: TLinkState) {
          return <Actions record={s}>
            <Popconfirm title="确定删除这条友情链接？" onConfirm={() => delit(_, remove)} okText="确定" cancelText="取消">
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
            <Popconfirm 
              title={
                s.link_status 
                  ? '确定要取消通过这条友情链接？' 
                  : '确定要通过这条友情链接？'
              } 
              onConfirm={() => changeStatus(_, !s.link_status)} 
              okText="确定" 
              cancelText="取消"
            >
              <Typography.Link disabled={_ === 0}>{s.link_status ? '取消通过' : '通过'}</Typography.Link>
            </Popconfirm>
          </Actions>
        }
      }
    ]
  }, []);
  const _data = useMemo(() => {
    switch (status) {
      case -1: return data.filter(d => !d.link_status);
      case 1: return data.filter(d => !!d.link_status);
      default: return data;
    }
  }, [status, data])
  return <Row gutter={[24, 24]}>
    <Col span={24}>
      <Typography.Title level={5}><Space><FilterOutlined />过滤</Space></Typography.Title>
      <Radio.Group onChange={e => setStatus(e.target.value)} value={status}>
        <Radio value={0}>全部</Radio>
        <Radio value={1}>已通过</Radio>
        <Radio value={-1}>待审核</Radio>
      </Radio.Group>
    </Col>
    <Col span={24}>
      <EditableTable<TLinkState> 
        rowKey="id" 
        addText="添加友情链接"
        dataSource={_data} 
        getColumns={getColums} 
        post={post} 
        addNew={createNewLinkState} 
        loading={loading} 
        pagination={false}
        addable={r => r.id === 0}
      />
    </Col>
  </Row>
}