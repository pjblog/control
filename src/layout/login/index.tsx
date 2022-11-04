import dayjs from 'dayjs';
import styles from './style.module.less';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Flex } from '../../components';
import { Input, Button, message, Typography, Avatar } from 'antd';
import { useAsyncCallback } from '@codixjs/fetch';
import { RightOutlined, PlusOutlined, EnterOutlined, UpOutlined } from '@ant-design/icons';
import logo from '../../resource/logo.png';
import { doLogin } from '../../service';
import { eventEmitter } from '@codixjs/codix';

const windowSupported = typeof window !== 'undefined';
const _account = windowSupported && window.localStorage.getItem('pjblog_account');
const _nickname = windowSupported && window.localStorage.getItem('pjblog_nickname');
const _avatar = windowSupported && window.localStorage.getItem('pjblog_avatar');
const _time = windowSupported && window.localStorage.getItem('pjblog_login_time');

export function Login() {
  const [mode, setMode] = useState(true);
  useEffect(() => {
    if (!!_account) {
      setMode(false);
    }
  }, [])
  return <Flex full block align="center" valign="middle" direction="vertical" className={styles.container}>
    <div className={styles.login}>
      <div className={styles.logo}><img src={logo} alt="" /></div>
    {
      !!_account && !mode
        ? <UsedLogin setMode={setMode} />
        : <CommonLogin />
    }
    </div>
  </Flex>
}

function CommonLogin() {
  const [account, setAccount] = useState<string>(_account);
  const [password, setPassword] = useState<string>(null);
  const { loading, submit } = useLogin(account, password);
  return <Fragment>
    <Typography.Paragraph className={styles.titletip}>管理员登录</Typography.Paragraph>
    <Flex className={styles.common} block direction="vertical" gap={[0, 16]}>
      <Flex className={styles.channel} direction="vertical" gap={[0, 8]} block>
        <div className={styles.label}>账号</div>
        <Input disabled={loading} placeholder="管理员账号" value={account} onChange={e => setAccount(e.target.value)} size="large" allowClear />
      </Flex>
      <Flex className={styles.channel} direction="vertical" gap={[0, 8]} block>
        <div className={styles.label}>密码</div>
        <Input disabled={loading} placeholder="管理员密码" value={password} onChange={e => setPassword(e.target.value)} type="password" size="large" allowClear />
      </Flex>
    </Flex>
    <Button loading={loading} size="large" block type="primary" onClick={submit} style={{ marginTop: 36 }}>登录</Button>
    {/* {!!props.setMode && <Flex align="right" valign="middle" className={styles.quick}>
      <Typography.Link onClick={() => props.setMode(false)}>使用快捷登录</Typography.Link>
      <RightOutlined className={styles.icon} />
    </Flex>} */}
  </Fragment>
}

function UsedLogin(props: React.PropsWithoutRef<{ setMode: React.Dispatch<React.SetStateAction<boolean>> }>) {
  const [password, setPassword] = useState<string>(null);
  const [open, setOpen] = useState(false);
  const lastLoginedTime = useMemo(() => dayjs(Number(_time)), [_time]);
  const { loading, submit } = useLogin(_account, password);
  return <div className={styles.used}>
    <Typography.Paragraph className={styles.titletip}>请选择登录账号</Typography.Paragraph>
    <div className={styles.latest}>
      <Flex block align="between" className={styles.title}>上次登录<span>{lastLoginedTime.format('YYYY/MM/DD HH:mm:ss')}</span></Flex>
      <Flex block gap={12} valign="middle" className={styles.channel}>
        <Avatar src={_avatar} size={36} onClick={() => setOpen(!open)} />
        <Flex span={1} direction="vertical" valign="middle" onClick={() => setOpen(!open)}>
          <div className={styles.nickname}>{_nickname}</div>
          <div className={styles.account}>@{_account}</div>
        </Flex>
        <div className={styles.action} onClick={() => setOpen(!open)}>
          {open? <UpOutlined />: <RightOutlined />}
        </div>
      </Flex>
      {
        !open ? null
          : <div className={styles.password}>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="请输入密码..." 
                autoFocus 
                disabled={loading}
                suffix={<EnterOutlined className={styles.enter} />}
                onPressEnter={submit}
                bordered={false}
              />
            </div>
      }
    </div>
    {
      !open
        ? <Button 
            type="primary" 
            block 
            size="large" 
            icon={<PlusOutlined />} 
            className={styles.other} 
            disabled={loading} 
            onClick={() => props.setMode(true)}
          >使用其他账号登录</Button>
        : null
    }
  </div>
}

function useLogin(account: string, password: string) {
  const { loading, execute } = useAsyncCallback(() => doLogin(account, password));
  const submit = useCallback(() => {
    execute()
      .then((data: { account: string, nickname: string, avatar: string, time: number }) => {
        windowSupported && window.localStorage.setItem('pjblog_account', data.account);
        windowSupported && window.localStorage.setItem('pjblog_nickname', data.nickname);
        windowSupported && window.localStorage.setItem('pjblog_avatar', data.avatar);
        windowSupported && window.localStorage.setItem('pjblog_login_time', data.time + '');
      })
      .then(() => message.success('登录成功，正在跳转...'))
      .then(() => eventEmitter.emit('reload' as any))
      .catch(e => {
        const status = e.status;
        switch (status) {
          case 403: return message.warn('密码不正确');
          case 404: return message.warn('账号不存在');
          default: return message.error(e.message);
        }
      })
  }, [execute]);

  return {
    loading,
    submit,
  }
}