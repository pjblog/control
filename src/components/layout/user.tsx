import styles from './index.module.less';
import { useAuthorize } from "../authorize";
import { Tooltip, Avatar } from 'antd';

export function User() {
  const user = useAuthorize();
  return <div className={styles.user}>
    <Tooltip title={user.nickname} placement="right">
      <Avatar src={user.avatar} size={36} />
    </Tooltip>
  </div>
}