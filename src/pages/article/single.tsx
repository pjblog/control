import { Divider, Typography, Popconfirm, message, Space, Avatar, Checkbox } from 'antd';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { redirect } from '@codixjs/codix';
import { useAsyncCallback } from '@codixjs/fetch';
import { TArticle, deleteArticle, setCommenable } from '../../service';

export function Article(props: React.PropsWithoutRef<TArticle & { reload: () => void }>) {
  const { execute, loading } = useAsyncCallback(() => deleteArticle(props.id))
  const submit = () => {
    execute()
      .then(() => message.success('删除成功，正在刷新列表'))
      .then(props.reload)
      .catch(e => message.error(e.message));
  }
  return <div className={styles.article}>
    <Typography.Title level={4}>{props.title}</Typography.Title>
    <Typography.Paragraph>
      <CommentAble id={props.id} value={props.commentable} />
      
      {
        !!props?.category?.id && <Fragment>
          <Divider type="vertical" />
          <Space>
            <span className={styles.ln}>分类</span>
            <span className={styles.lv}>{props.category.name}</span>
          </Space>
        </Fragment>
      }
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
      <Space>
        <Avatar size={16} src={props.user.avatar} />
        {props.user.nickname}
      </Space>
      <Divider type="vertical" />
      <span>发表于：{formatTime(props.ctime)}</span>
      <Divider type="vertical" />
      <span>更新于：{formatTime(props.mtime)}</span>
      <Divider type="vertical" />
      <span>阅读量：{props.readCount}</span>
      <Divider type="vertical" />
      <span>评论量：{props.comments}</span>
      <Divider type="vertical" />
      <Typography.Link onClick={() => redirect('/comment/' + props.id)} disabled={loading}>查看评论</Typography.Link>
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

function CommentAble(props: React.PropsWithoutRef<{ value: boolean, id: number }>) {
  const [value, setValue] = useState(props.value);
  const { loading, execute } = useAsyncCallback((val: boolean) => setCommenable(props.id, val));
  const submit = useCallback((e: boolean) => {
    execute(e)
      .then(() => setValue(e))
      .then(() => message.success('保存成功'))
      .catch(e => message.error(e.message));
  }, [execute])
  useEffect(() => setValue(props.value), [props.value]);
  return <Checkbox checked={value} onChange={e => submit(!!e.target.checked)} disabled={loading}>
    {
      loading
        ? '正在保存...'
        : value
          ? '允许评论'
          : '禁止评论'
    }
  </Checkbox>
}