import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { getUsers, useBaseRequestConfigs, TUserInfo, setAdminStatus, setForbidenStatus } from '../../service';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { Avatar, message, Select, Switch, Table, Input, Divider, Checkbox, Row, Col } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Flex } from '../../components';
import { useAdminInfo } from '../../layout/context';

function createColumns(me: TUserInfo): ColumnsType<TUserInfo> {
  return [
    {
      title: '#',
      dataIndex: 'id',
      width: 30,
      className: styles.gray,
    },
    {
      title: '用户',
      render(state: TUserInfo) {
        return <Flex valign="middle" gap={8}>
          <Avatar src={state.avatar} size="large" shape="square" />
          <div>
            <div>{state.nickname}</div>
            <div className={styles.gray}>@{state.account}</div>
          </div>
        </Flex>
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '注册时间',
      width: 200,
      dataIndex: 'gmt_create',
      render(d: string) {
        return dayjs(d).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '登录时间',
      dataIndex: 'gmt_modified',
      width: 200,
      render(d: string) {
        return dayjs(d).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '管理员？',
      width: 100,
      render(state: TUserInfo) {
        return <AdminChanger account={state.account} value={state.level} disabled={state.account === me.account} />
      }
    },
    {
      title: '禁止？',
      width: 100,
      render(state: TUserInfo) {
        return <ForbidenChanger account={state.account} value={state.forbiden} disabled={state.account === me.account} />
      }
    }
  ]
}

export default function UserPage() {
  const me = useAdminInfo();
  const columns = useMemo(() => createColumns(me), [me]);
  const configs = useBaseRequestConfigs();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [admin, setAdmin] = useState(false);
  const [forbiden, setForbiden] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const { data, loading } = useAsync('users', () => getUsers({
    page, size, keyword,
    admin: Number(admin),
    forbiden: Number(forbiden)
  }, configs), [page, size, admin, forbiden, keyword]);
  
  return <Row gutter={[24, 24]}>
    <Col span={24}>
      <Flex valign="middle" align="between">
        <Input.Search autoFocus style={{ width: 250, }} onSearch={e => setKeyword(e)} placeholder="输入搜索的用户ID或者昵称" onChange={e => {
          if (!e.target.value) {
            setKeyword(undefined);
          }
        }} />
        <div>
          <Checkbox onChange={e => setAdmin(e.target.checked)}>管理员</Checkbox>
          <Divider type="vertical" />
          <Checkbox onChange={e => setForbiden(e.target.checked)}>禁止登录的用户</Checkbox>
        </div>
      </Flex>
    </Col>
    <Col span={24}>
      <Table rowKey="id" columns={columns} dataSource={data.users} loading={loading} pagination={{
        total: data.total,
        pageSize: size,
        current: page,
        onChange: (a: number, b: number) => {
          setPage(a);
          setSize(b);
        }
      }} />
    </Col>
  </Row>
  
}

const adminFields = [
  {
    label: '是',
    value: 0
  },
  {
    label: '否',
    value: 1
  }
]
function AdminChanger(props: React.PropsWithoutRef<{ account: string, value: number, disabled: boolean }>) {
  const [status, setStatus] = useState(props.value);
  const { loading, execute } = useAsyncCallback((s: boolean) => setAdminStatus(props.account, s));
  const submit = (value: number) => {
    execute(value === 0)
      .then(() => setStatus(value))
      .catch(e => {
        switch (e.code) {
          case 404: return message.error('找不到用户');
          case 406: return message.warn('不能修改自己的限制');
          default: return message.error(e.message);
        }
      });
  }
  return <Select disabled={props.disabled} value={status} options={adminFields} loading={loading} onChange={submit} />
}

function ForbidenChanger(props: React.PropsWithoutRef<{ account: string, value: boolean, disabled: boolean }>) {
  const [status, setStatus] = useState(props.value);
  const { loading, execute } = useAsyncCallback((s: boolean) => setForbidenStatus(props.account, s));
  const submit = (value: boolean) => {
    execute(!value)
      .then(() => setStatus(!value))
      .catch(e => {
        switch (e.code) {
          case 404: return message.error('找不到用户');
          case 406: return message.warn('不能修改自己的限制');
          default: return message.error(e.message);
        }
      });
  }
  return <Switch disabled={props.disabled} checked={!status} checkedChildren="允许" unCheckedChildren="禁止" onChange={submit} loading={loading} />
}