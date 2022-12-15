import { Button, Typography } from 'antd';
import styles from './index.module.less';
export function Activity() {
  return <div className={styles.activity}>
    <div className={styles.title}>Start coding instantly with GitHub Codespaces</div>
    <Typography.Paragraph className={styles.summary}>Spin up fully configured dev environments on powerful VMs that start in seconds. Get up to 60 hours a month of free time.</Typography.Paragraph>
    <Button type="primary">参与</Button>
  </div>
}