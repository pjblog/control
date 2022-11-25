import styles from './index.module.less';
import { PropsWithChildren } from "react";
import { Flex } from '../flex';

export function Box(props: PropsWithChildren<{}>) {
  return <div className={styles.box}>{props.children}</div>
}

function List(props: PropsWithChildren<{ title: string, size?: number }>) {
  return <Flex>
    <div style={{ width: props.size }} className={styles.title}>{props.title}</div>
    <Flex span={1} className={styles.list}>{props.children}</Flex>
  </Flex>
}

Box.List = List;