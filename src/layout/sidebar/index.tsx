import React, { useMemo } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import { Flex } from '../../components';
import { Avatar, Typography } from 'antd';
import { LockFilled, HomeFilled, FileExclamationFilled, FileTextTwoTone, AppstoreTwoTone, SkinTwoTone } from '@ant-design/icons';
import { useAdminInfo } from '../context';
import { menus } from '../menus';
import { useRequestPath, redirect } from '@codixjs/codix';
import { TCallbackReturnType, usePath } from '../../hooks';
import type { TMenu } from '../menus';

export function Sidebar() {
  const me = useAdminInfo();
  return <Flex className={styles.sidebar} full direction="vertical">
    <Flex block className={styles.user} valign="middle" gap={8}>
      <Avatar src={me.avatar} shape="square" size={36} />
      <Flex block direction="vertical" span={1}>
        <div className={styles.nickname}>{me.nickname}</div>
        <div className={styles.account}>@{me.account}</div>
      </Flex>
    </Flex>
    <Flex span={1} block scroll="y" direction="vertical">
      <ul className={styles.menus}>
        { menus.map(menu => <Channel key={menu.code} {...menu} />) }
      </ul>
      {/* <Typography.Paragraph className={styles.quicks}>快捷入口</Typography.Paragraph>
      <ul className={styles.tools}>
        <li onClick={() => this.redirect('/article/post')}><FileTextTwoTone twoToneColor="#eb2f96" />写文章</li>
        <li><AppstoreTwoTone twoToneColor="#52c41a" />安装模块</li>
      </ul>
      <Typography.Paragraph className={styles.quicks}>开发文档</Typography.Paragraph>
      <ul className={styles.tools}>
        <li onClick={() => this.redirect('/article/post')}><FileTextTwoTone twoToneColor="#eb2f96" />PJBlog使用文档</li>
        <li onClick={() => this.redirect('/article/post')}><FileTextTwoTone twoToneColor="#eb2f96" />PJBlog疑难解答</li>
        <li><AppstoreTwoTone twoToneColor="#52c41a" />插件开发文档</li>
        <li><SkinTwoTone />主题开发文档</li>
      </ul> */}
    </Flex>
    <ul className={styles.extraList}>
      <li><HomeFilled />官网</li>
      <li><FileExclamationFilled />开发文档</li>
      <li><LockFilled />退出登录</li>
    </ul>
  </Flex>
}

function Channel<T extends keyof TCallbackReturnType>(props: React.PropsWithoutRef<TMenu<T>>) {
  const path = useRequestPath<string>();
  const target = usePath(props.code);
  const url = useMemo(() => target.toString(), [target]);
  return <li className={classnames({
    [styles.active]: url !== '/'
      ? path.startsWith(url)
      : url === path,
  })} onClick={() => redirect(url)}>
    <Flex block align="between" valign="middle">
      <div>{props.icon}{props.label}</div>
      <div className={styles.code}>{props.code}</div>
    </Flex>
  </li>
}