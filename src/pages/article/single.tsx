import { Divider, Typography, Popconfirm, message, Space } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { redirect } from '@codixjs/codix';
import { useAsyncCallback } from '@codixjs/fetch';
import { TArticle, deleteArticle } from '../../service';

export function Article(props: React.PropsWithoutRef<TArticle & { reload: () => void }>) {
  const { execute, loading } = useAsyncCallback(() => deleteArticle(props.id))
  const submit = () => {
    execute()
      .then(() => message.success('删除成功，正在刷新列表'))
      .then(props.reload)
      .catch(e => message.error(e.message));
  }
  return <div className={styles.article}>
    <Typography.Title level={4}>{props.title} <span>{props.category.name}</span></Typography.Title>
    <Typography.Paragraph>
      <Space>
        <span className={styles.ln}>分类</span>
        <span className={styles.lv}>{props.category.name}</span>
      </Space>
      <Divider type="vertical" />
      {
        !!props.tags.length && <Space>
          <span className={styles.ln}>标签</span>
          {props.tags.map(tag => {
            return <span className={styles.lv} key={tag.id}>{tag.name}</span>;
          })}
        </Space>
      }
    </Typography.Paragraph>
    <Typography.Paragraph className={styles.summary}>{props.summary}</Typography.Paragraph>
    <Typography.Text className={styles.extra}>
      <span>发表于：{formatTime(props.ctime)}</span>
      <Divider type="vertical" />
      <span>更新于：{formatTime(props.mtime)}</span>
      <Divider type="vertical" />
      <Typography.Link onClick={() => redirect('/article/post/' + props.id)} disabled={loading}>编辑</Typography.Link>
      <Divider type="vertical" />
      <Popconfirm title="确定删除此文章？删除后无法恢复，请慎重！" okText="确定" cancelText="取消" onConfirm={submit}>
        <Typography.Link disabled={loading}>删除</Typography.Link>
      </Popconfirm>
    </Typography.Text>
  </div>
}

function formatTime(time: string) {
  return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
}