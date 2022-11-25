import React, { useMemo } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import { Flex } from '../../components';
import { Avatar } from 'antd';
import { ChromeFilled } from '@ant-design/icons';
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
        <li onClick={() => window.location.href = '/'}>
          <Flex block align="between" valign="middle">
            <div><ChromeFilled />博客</div>
            <div className={styles.code}>BLOG</div>
          </Flex>
        </li>
        { menus.map(menu => <Channel key={menu.code} {...menu} />) }
      </ul>
    </Flex>
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