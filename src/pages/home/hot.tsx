import styles from './index.module.less';
import { Flex, useGetAsync } from "@pjblog/control-hooks";
import { Card, List, Space, Typography } from "antd";
import { EyeFilled, EditFilled } from '@ant-design/icons';
import { usePath } from '../../hooks';

interface IArticle {
  id: number,
  article_title: string,
  article_summary: string,
  article_read_count: number
}

export function Hot() {
  const ARTICLE = usePath('EDIT_ARTICLE');
  const { data } = useGetAsync<IArticle[]>({
    id: 'hot',
    url: '/-/article/hot',
    querys: {
      size: 5
    }
  })
  return <Card size="small" className={styles.articleCard}>
    <List
      size="small"
      bordered={false}
      dataSource={data}
      renderItem={(item) => <List.Item>
        <div className={styles.article}>
          <Typography.Paragraph className={styles.title}>{item.article_title}</Typography.Paragraph>
          <Typography.Paragraph className={styles.summary}>{item.article_summary}</Typography.Paragraph>
          <Flex align="between" valign="middle" className={styles.extras}>
            <Space className={styles.item}><EyeFilled />{item.article_read_count}</Space>
            <Typography.Link className={styles.item} onClick={() => ARTICLE.redirect({ id: item.id })}><EditFilled /></Typography.Link>
          </Flex>
        </div>
      </List.Item>}
    />
  </Card>
}