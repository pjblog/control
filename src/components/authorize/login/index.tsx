import styles from './index.module.less';
import logo from '../../../resource/logo.png';
import { Flex } from "../../flex";
import { Card, Typography, Input, Button, Space, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { PropsWithoutRef, useCallback, useEffect, useState } from 'react';
import { useAsyncCallback } from '@codixjs/fetch';
import { request } from '../../request';

export function Login(props: PropsWithoutRef<{ size?: number, reload: () => void }>) {
  const [account, setAccount] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const { execute, loading } = useAsyncCallback(async () => {
    const res = await request.put('/login', { account, password });
    return res.data;
  })

  const submit = useCallback(() => {
    if (!account) return message.warning('请输入账号');
    if (!password) return message.warning('请输入密码');
    execute()
      .then(() => window.localStorage.setItem('pjblog.account', account))
      .then(props.reload)
      .then(() => message.success('登录成功'))
      .catch(e => message.error(e.message));
  }, [execute, account, password]);

  useEffect(() => {
    const _account = window.localStorage.getItem('pjblog.account');
    if (_account) {
      setAccount(_account);
    }
  }, [])

  return <Flex block full align="center" valign="middle" className={styles.container}>
    <Card title={null} hoverable>
      <Flex>
        <div className={styles.slogen}>
          <Typography.Paragraph>
            <img src={logo} alt="PJBlog.Logo" height={36} />
          </Typography.Paragraph>
          <Typography.Paragraph>欢迎回来，您还未登录！</Typography.Paragraph>
          <ul>
            <li>官方博客：<Typography.Link href="https://www.pjhome.net" target="_blank">https://www.pjhome.net</Typography.Link></li>
            <li>技术博客：<Typography.Link href="https://evio.pjhome.net" target="_blank">https://evio.pjhome.net</Typography.Link></li>
            <li>官方论坛：<Typography.Link href="https://bbs.pjhome.net" target="_blank">https://bbs.pjhome.net</Typography.Link></li>
          </ul>
        </div>
        <div className={styles.login}>
          <Typography.Paragraph>
            <Space className={styles.tip}>
              <SafetyCertificateOutlined />
              通过账号密码登录
            </Space>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Input 
              value={account}
              disabled={loading}
              placeholder="请输入用户名" 
              style={{ width: props.size || 300 }} 
              prefix={<UserOutlined />}
              onChange={e => setAccount(e.target.value)}
              onPressEnter={submit}
            />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Input 
              value={password}
              type="password"
              disabled={loading}
              placeholder="请输入密码" 
              style={{ width: props.size || 300 }} 
              prefix={<LockOutlined />}
              onChange={e => setPassword(e.target.value)}
              onPressEnter={submit}
              autoFocus
            />
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Button type="primary" block loading={loading} onClick={submit}>登录</Button>
          </Typography.Paragraph>
        </div>
      </Flex>
    </Card>
  </Flex>
}