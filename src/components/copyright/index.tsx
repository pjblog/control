import styles from './index.module.less';
import { Flex } from "../flex";
import { Divider, Space, Typography } from 'antd';
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';

export function CopyRight() {
  return <Flex direction="vertical" align="center" valign="middle" block className={styles.copyright}>
    <Typography.Text>
      <span>PJBlog Feelings</span>
      <Divider type="vertical" />
      <span>BSD Licensed</span>
      <Divider type="vertical" />
      <Typography.Link href="https://gitlab.baizhun.cn/ecosystem/baizhun.publish.system" target="_blank"><GithubOutlined /> Github</Typography.Link>
    </Typography.Text>
    <Typography.Text>
      <span>Copyright <CopyrightOutlined />2004-present</span>
      <Divider type="vertical" />
      <Space>
        <Typography.Link href="http://www.pjhome.net" target="_blank">PJHome.net</Typography.Link>
        <span>All Rights Reserved.</span>
      </Space>
    </Typography.Text>
  </Flex>
}