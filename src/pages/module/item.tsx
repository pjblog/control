import { Typography } from 'antd';
import React from 'react';
import styles from './index.module.less';
import { TState } from './types';

export function Item(props: React.PropsWithoutRef<TState>) {
  return <div className={styles.modal}>
    <Typography.Paragraph className={styles.nametitle}>{props.name}@{props.version}</Typography.Paragraph>
    <Typography.Paragraph className={styles.description}>{props.description}</Typography.Paragraph>
  </div>
}