import styles from './index.module.less';
import { Flex } from "@pjblog/control-hooks";
import { Card } from "antd";
import { PlusOutlined, CodeSandboxOutlined, TeamOutlined } from '@ant-design/icons';
import { PropsWithoutRef, ReactNode } from 'react';
import { usePath } from '../../hooks';

export function Quick() {
  const ARTICLE = usePath('POST_ARTICLE');
  const USER = usePath('USERS');
  const WIDGET = usePath('WIDGETS');
  return <Flex block valign="middle" align="between" gap={8} className={styles.boxwrap}>
    <Item icon={<PlusOutlined />} title="文章" onClick={() => ARTICLE.redirect()} />
    <Item icon={<TeamOutlined />} title="成员" onClick={() => USER.redirect()} />
    <Item icon={<CodeSandboxOutlined />} title="模块" onClick={() => WIDGET.redirect()} />
  </Flex>
}

export function Item(props: PropsWithoutRef<{
  icon: ReactNode,
  title: ReactNode,
  onClick?: () => void
}>) {
  return <Flex span={1} scroll="hide" align="center" valign="middle" direction="vertical" className={styles.quick} gap={[0, 12]} onClick={props.onClick}>
    {props.icon}
    <span className={styles.label}>{props.title}</span>
  </Flex>
}