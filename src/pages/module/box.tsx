import React from 'react';
import styles from './index.module.less';

export function Box(props: React.PropsWithChildren<{ title: React.ReactNode }>) {
  return <div className={styles.box}>
    <div className={styles.title}>{props.title}</div>
    <div className={styles.content}>{props.children}</div>
  </div>
}