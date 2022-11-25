import styles from './index.module.less';
import { useAsync } from "@codixjs/fetch";
import { PropsWithoutRef } from "react";
import { getHotArticles, THotArticle, useBaseRequestConfigs } from "../../../service";
import { List, Space, Typography } from 'antd';
import { Flex } from "../../../components";
import { EyeFilled, FullscreenOutlined } from '@ant-design/icons';
import { usePath } from '../../../hooks';

const { Item } = List;

export function HotArticles(props: PropsWithoutRef<{ size: number }>) {
  const configs = useBaseRequestConfigs();
  const { data } = useAsync('article:hot', () => getHotArticles(props.size, configs), [props.size]);
  return <List
    dataSource={data}
    renderItem={item => <ListItem {...item} />}
  />
}

function ListItem(props: PropsWithoutRef<THotArticle>) {
  const ARTICLE = usePath('MODIFY_ARTICLE');
  return <Item>
    <Flex direction="vertical" block>
      <Typography.Paragraph>{props.title}</Typography.Paragraph>
      <Typography.Text className={styles.summary}>{props.summary}</Typography.Text>
      <Flex block align="between" valign="middle" className={styles.extra}>
        <Typography.Link className={styles.count}>
          <Space>
            <EyeFilled />
            <span>{props.count}</span>
          </Space>
        </Typography.Link>
        <FullscreenOutlined style={{ cursor: 'pointer' }} onClick={() => ARTICLE.redirect({ id: props.id })} />
      </Flex>
    </Flex>
  </Item>
}