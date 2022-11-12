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
    </Flex>
    {/* <div className={styles.toolbar}>
      <Flex className={styles.tools} block>
        <Flex span={1} className={styles.tool} align="center" direction="vertical" gap={[0, 4]}>
          <HomeFilled className={styles.icon} />
          <span>官网</span>
        </Flex>
        <Flex span={1} className={styles.tool} align="center" direction="vertical" gap={[0, 4]}>
          <FileExclamationFilled className={styles.icon} />
          <span>文档</span>
        </Flex>
        <Flex span={1} className={styles.tool} align="center" direction="vertical" gap={[0, 4]}>
          <LockFilled className={styles.icon} />
          <span>退出</span>
        </Flex>
      </Flex>
    </div> */}
    {/* <Flex align="center" valign="middle">
      Copyright@PJHome.net v1.0.0 <br />
    </Flex> */}
    {/* <ul className={styles.extraList}>
      <li><HomeFilled />官网</li>
      <li><FileExclamationFilled />开发文档</li>
      <li><LockFilled />退出登录</li>
    </ul> */}
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