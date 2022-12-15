import styles from './index.module.less';
import { PropsWithChildren, ReactNode } from "react";
import { Statistic } from 'antd';
import { Flex } from '@pjblog/control-hooks';
import { SyncOutlined } from '@ant-design/icons';

export function Box(props: PropsWithChildren<{
  title: ReactNode,
  value: number,
  loading?: boolean,
  refresh?: () => void
}>) {
  return <div className={styles.box}>
    <Flex align="between" valign="top" gap={24}>
      <Statistic title={props.title} value={props.value} loading={props.loading} />
      {
        !!props.refresh && <div className={styles.extra} onClick={props.refresh}>
          <SyncOutlined />
        </div>
      }
    </Flex>
    {props.children}
  </div>
}

function Item(props: PropsWithChildren<{}>) {
  return <div className={styles.item}>{props.children}</div>
}

Box.Item = Item;