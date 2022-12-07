import styles from './index.module.less';
import dayjs from 'dayjs';
import { Flex, useGetAsync, IUserInfoState, useAuthorize, request } from "@pjblog/control-hooks";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Space, Input, Checkbox, Avatar, Table, message, Select, Switch } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useAsyncCallback } from '@codixjs/fetch';

export default function Page() {
  const me = useAuthorize();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [admin, setAdmin] = useState(false);
  const [forbiden, setForbiden] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const columns = useMemo(() => createColumns(me), [me]);
  const { data, loading } = useGetAsync({ 
    id: 'users',
    url: '/-/users', 
    querys: {
      keyword,
      admin: Number(admin), 
      forbiden: Number(forbiden),
      page, size, 
    }
  }, [page, size, admin, forbiden, keyword]);

  return <Fragment>
    <Flex className={styles.toolbar} align="between" valign="middle">
      <Space size={12}>
        <span>筛选</span>
        <Checkbox onChange={e => setAdmin(e.target.checked)}>管理员</Checkbox>
        <Checkbox onChange={e => setForbiden(e.target.checked)}>禁止登录的用户</Checkbox>
      </Space>
      <Space>
        <Input.Search enterButton="搜索" autoFocus style={{ width: 300, }} onSearch={e => setKeyword(e)} placeholder="输入搜索的用户ID或者昵称" onChange={e => {
          if (!e.target.value) {
            setKeyword(undefined);
          }
        }} />
      </Space>
    </Flex>
    <div className="container">
      <Table rowKey="id" columns={columns} dataSource={data.dataSource} loading={loading} size="middle" pagination={{
        total: data.total,
        pageSize: size,
        current: page,
        onChange: (a: number, b: number) => {
          setPage(a);
          setSize(b);
        }
      }} />
    </div>
  </Fragment>
}

function createColumns(me: IUserInfoState): ColumnsType<IUserInfoState> {
  return [
    {
      title: '用户',
      render(state: IUserInfoState) {
        return <Flex valign="middle" gap={8}>
          <Avatar src={state.avatar} size="large" shape="square" />
          <div>
            <div>{state.nickname}</div>
            <div className={styles.account}>@{state.account}</div>
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
      title: '等级',
      width: 150,
      render(state: IUserInfoState) {
        return <AdminChanger id={state.id} value={state.level} disabled={state.account === me.account} />
      }
    },
    {
      title: '状态',
      width: 100,
      render(state: IUserInfoState) {
        return <ForbidenChanger id={state.id} value={state.forbiden} disabled={state.account === me.account} />
      }
    }
  ]
}

function AdminChanger(props: React.PropsWithoutRef<{ id: number, value: number, disabled: boolean }>) {
  const me = useAuthorize();
  const [status, setStatus] = useState(props.value);
  const { execute, loading } = useAsyncCallback(async (level: number) => {
    const res = await request.post('/-/user/' + props.id + '/admin', {
      admin: level,
    })
    return res.data;
  })
  const submit = useCallback((value: number) => {
    execute(value)
      .then(() => setStatus(value))
      .catch(e => message.error(e.message));
  }, [execute, setStatus]);
  return <Select 
    disabled={props.disabled} 
    value={status} 
    options={[
      {
        label: '超级管理员',
        value: 0,
        disabled: me.level > 0
      },
      {
        label: '管理员',
        value: 1,
        disabled: me.level >= 1
      },
      {
        label: '普通成员',
        value: 99
      }
    ]} 
    loading={loading} 
    onChange={submit} 
  />
}

function ForbidenChanger(props: React.PropsWithoutRef<{ id: number, value: boolean, disabled: boolean }>) {
  const [status, setStatus] = useState(props.value);
  const { execute, loading } = useAsyncCallback(async (status: boolean) => {
    const res = await request.post('/-/user/' + props.id + '/forbiden', {
      forbiden: status,
    })
    return res.data;
  })
  const submit = useCallback((value: boolean) => {
    execute(!value)
      .then(() => setStatus(!value))
      .catch(e => message.error(e.message));
  }, [execute, setStatus]);
  return <Switch 
    disabled={props.disabled} 
    checked={!status} 
    checkedChildren="允许" 
    unCheckedChildren="禁止" 
    onChange={submit} 
    loading={loading} 
  />
}