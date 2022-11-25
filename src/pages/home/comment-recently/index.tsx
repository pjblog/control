import styles from './index.module.less';
import { useAsync } from "@codixjs/fetch";
import { PropsWithoutRef } from "react";
import { getRecentlyComments, useBaseRequestConfigs } from "../../../service";
import { List, Avatar, Typography, Divider } from 'antd';
import dayjs from "dayjs";
import { Flex } from "../../../components";
import { usePath } from "../../../hooks";

export function CommentRecently(props: PropsWithoutRef<{ size: number }>) {
  const configs = useBaseRequestConfigs();
  const COMMENT = usePath('ARTICLE_COMMENT');
  const { data } = useAsync('comment:recently', () => getRecentlyComments(props.size, configs), [props.size]);
  return <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={item => (
      <List.Item>
        <Flex direction="vertical" block gap={[0, 8]}>
          <Flex block gap={8}>
            <Avatar src={item.user.avatar} shape="square" size={36} style={{
              position: 'relative',
              top: 4
            }} />
            <Flex span={1} direction="vertical">
              <Flex block scroll="hide">
                <Typography.Link ellipsis onClick={() => COMMENT.redirect({ id: item.article.id })} title={item.article.title}>
                  {item.article.title}
                </Typography.Link>
              </Flex>
              <span className={styles.user}>{item.user.nickname}<Divider type="vertical" />{dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Flex>
          </Flex>
          <div className={styles.content}>{item.content}</div>
        </Flex>
      </List.Item>
    )}
  />
}