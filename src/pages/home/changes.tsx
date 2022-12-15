import styles from './index.module.less';
import { Timeline, Typography } from "antd";
import { PropsWithChildren } from "react";
import { Flex } from '@pjblog/control-hooks';

const state: { time: string, text: string, url: string }[] = [
  { time: 'Yesterday', text: 'Dormant Users Report for Enterprise Accounts', url: 'http://baidu.com' },
  { time: 'Yesterday', text: 'GitHub Actions – Sharing actions and reusable workflows from private repositories is now GA', url: 'http://baidu.com' },
  { time: '2 days ago', text: 'Enable secret scanning with the enterprise-level REST API', url: 'http://baidu.com' },
  { time: '2 days ago', text: 'Unarchive a repository via the REST API', url: 'http://baidu.com' }
]

export function Changes() {
  return <div className={styles.changes}>
    <div className={styles.simpleTitle}>版本更新</div>
    <Timeline>
      {
        state.map(({ time, text, url }, index) => {
          return <Item time={time} url={url} key={index}>{text}</Item>
        })
      }
      <Timeline.Item color="gray">
        <Typography.Link href="https://changes.pjhome.net" target="_blank" className={styles.more}>查看更多</Typography.Link>
      </Timeline.Item>
    </Timeline>
  </div>
}

function Item(props: PropsWithChildren<{ time: string, url: string }>) {
  return <Timeline.Item color="gray">
    <Flex block direction="vertical">
      <div className={styles.time}>{props.time}</div>
      <div className={styles.text}>
        <Typography.Link href={props.url} target="_blank">{props.children}</Typography.Link>
      </div>
    </Flex>
  </Timeline.Item>
}