import styles from './index.module.less';
import { useAsync } from "@codixjs/fetch";
import { Avatar, Space } from "antd";
import { PropsWithoutRef } from "react";
import { Flex } from "../../../components";
import { getActivedUsers, useBaseRequestConfigs } from "../../../service";
import { List, Typography, Divider } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

export function ActivedUsers(props: PropsWithoutRef<{ size: number }>) {
  const configs = useBaseRequestConfigs();
  const { data } = useAsync('user:active', () => getActivedUsers(props.size, configs), [props.size]);
  return <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={item => (
      <List.Item>
        <Flex block gap={8}>
          <Avatar src={item.avatar} shape="square" size={36} style={{
            position: 'relative',
            top: 4
          }} />
          <Flex span={1} direction="vertical">
            <Flex block scroll="hide">
              <Typography.Text ellipsis title={item.nickname}>
                {item.nickname}
              </Typography.Text>
            </Flex>
            <span className={styles.extra}>
              @{item.account}
              <Divider type="vertical" />
              <Space>
                <CommentOutlined />
                {item.count}
              </Space>
            </span>
          </Flex>
        </Flex>
      </List.Item>
    )}
  />
}