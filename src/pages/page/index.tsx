import React, { useCallback, useMemo, useState } from "react";
import dayjs from 'dayjs';
import styles from './index.module.less';
import { useAsync, useAsyncCallback } from "@codixjs/fetch";
import { Space, Table, Typography, Popconfirm, message, Row, Col, Alert } from "antd";
import { ColumnsType } from "antd/lib/table";
import { usePath } from "../../hooks";
import { useBaseRequestConfigs } from "../../service"
import { deletePage, getPages, TPage } from "../../service/page";

export default function PagePage() {
  const configs = useBaseRequestConfigs();
  const PAGE = usePath('MODIFY_PAGE');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { data, execute } = useAsync('pages', () => getPages(configs));
  const columns = useMemo<ColumnsType<TPage>>(() => {
    return [
      {
        title: '#',
        width: 50,
        align: 'center',
        dataIndex: 'id',
      },
      {
        title: '标识',
        dataIndex: 'page_code'
      },
      {
        title: '路径',
        dataIndex: 'page_code',
        render(code: string) {
          return <Typography.Text copyable={{ text: '/pages/' + code }}>/pages/{code}</Typography.Text>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'gmt_create',
        render(time: string) {
          return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '更新时间',
        dataIndex: 'gmt_modified',
        render(time: string) {
          return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        render(id: number) {
          return <Space>
            <Typography.Link onClick={() => PAGE.redirect({ id })}>编辑</Typography.Link>
            <Delete id={id} reload={execute} />
          </Space>
        }
      }
    ]
  }, [])
  return <Row gutter={[24, 24]}>
    <Col span={24}>
      <Alert
        message="如何接入导航？"
        description={<Space direction="vertical">
          <ul className={styles.tips}>
            <li>此功能用于创建单独的说明性的页面。</li>
            <li>您可以复制路径地址到分类列表以在前台界面显示该单页。</li>
            <li>删除单页后需要您在分类列表中手动删除。</li>
            <li>此模块为非系统必要模块，可选择性使用此功能。</li>
          </ul>
        </Space>}
        type="info"
      ></Alert>
    </Col>
    <Col span={24}>
      <Table rowKey="id" dataSource={data.list} columns={columns} pagination={{
        current: page,
        pageSize: size,
        onChange(a, b) {
          setPage(a);
          setSize(b);
        }
      }} />
    </Col>
  </Row>
}

function Delete(props: React.PropsWithoutRef<{ id: number, reload: () => void }>) {
  const { loading, execute } = useAsyncCallback(deletePage);
  const submit = useCallback(() => {
    execute(props.id)
      .then(props.reload)
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message))
  }, [props.id, execute]);
  return <Popconfirm
    title="确定删除此单页？"
    onConfirm={submit}
    okText="确定"
    cancelText="取消"
  >
    <Typography.Link disabled={loading}>删除</Typography.Link>
  </Popconfirm>
  
}