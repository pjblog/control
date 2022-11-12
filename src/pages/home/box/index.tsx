import React from 'react';
import styles from './index.module.less';
import { Statistic } from 'antd';

export function Box(props: React.PropsWithChildren<{
  title: React.ReactNode,
  value: number,
  loading?: boolean,
}>) {
  return <div className={styles.box}>
    <Statistic title={props.title} value={props.value} loading={props.loading || false} />
    <div className={styles.extras}>
      {props.children}
    </div>
  </div>
}