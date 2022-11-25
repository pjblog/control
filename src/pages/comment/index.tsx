import dayjs from 'dayjs';
import classnames from 'classnames';
import { useRequestParam, useRequestQuery } from '@codixjs/codix';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { Col, Row, Avatar, Space, Typography, Spin, Divider, Pagination, Popconfirm, message, Result, Button } from 'antd';
import React, { useCallback } from 'react';
import { getControlCommentsByArticle, TArticleEntity, TCommentState, useBaseRequestConfigs, deleteComment } from '../../service';
import { numberic } from '../../utils';
import styles from './index.module.less';
import { Flex } from '../../components';
import { usePath } from '../../hooks';
import { UserOutlined, CommentOutlined } from '@ant-design/icons';

export default function CommentPage() {
  const locationA = usePath('COMMENT');
  const locationB = usePath('ARTICLE_COMMENT');
  const id = useRequestParam('id', numberic(0)) as number;
  const page = useRequestQuery('page', numberic(1)) as number;
  const size = useRequestQuery('size', numberic(10)) as number;
  const configs = useBaseRequestConfigs();
  const { data, loading, execute, error } = useAsync(
    `comment:${id}:page:${page}:size:${size}`, 
    () => getControlCommentsByArticle(id, page, size, configs),
    [id, page, size]
  );

  const redirect = (page: number, size: number) => {
    return !!data.article
      ? locationB.redirect({ id }, { page: page + '', size: size + '' })
      : locationA.redirect({}, { page: page + '', size: size + '' })
  }

  if (error?.code) return <Result
    status={error.code}
    title={error.code}
    subTitle={error.message}
  />

  return <Row gutter={[24, 24]}>
    {!!data.article && <Col span={24}><Article {...data.article} /></Col>}
    <Col span={24}>
      <Typography.Title level={5}><Space><CommentOutlined />评论列表</Space></Typography.Title>
    </Col>
    <Col span={24}>
      <Spin spinning={loading}>
        <Row gutter={[12,12]}>
          {data.list.map(chunk => {
            return <Col span={24} key={chunk.id}>
              {
                !!data.article
                  ? <ListB {...chunk} reload={execute} />
                  : <ListA {...chunk} reload={execute} />
              }
            </Col>
          })}
        </Row>
      </Spin>
    </Col>
    <Col span={24}>
      <Pagination current={page} pageSize={size} total={data.total} onChange={(a, b) => redirect(a, b)} />
    </Col>
  </Row>
}

function Article(props: React.PropsWithoutRef<TArticleEntity>) {
  return <div className={styles.container}>
    <Typography.Title level={3}>{props.article_title}</Typography.Title>
    <Typography.Paragraph className={styles.summary}>{props.article_summary}</Typography.Paragraph>
  </div>
}

function ListA(props: React.PropsWithoutRef<TCommentState & { reload: () => void }>) {
  const locationB = usePath('ARTICLE_COMMENT');
  return <div className={styles.container}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Flex block gap={8}>
        <Avatar src={props.user.avatar} shape="square" size="large" />
        <div className={styles.user}>
          <div className={styles.nickname}>
            <Typography.Link onClick={() => locationB.redirect({ id: props.article.id})}>
            《{props.article.title}》
            </Typography.Link>
          </div>
          <div className={styles.tips}>
            <Space>
              <UserOutlined />
              {props.user.nickname}
            </Space>
            <Divider type="vertical" />
            发表于：{dayjs(props.ctime).format('YYYY-MM-DD HH:mm:ss')}
            <Divider type="vertical" />
            来自：{props.ip}
            <Divider type="vertical" />
            <DeleteComment id={props.id} reload={props.reload} />
          </div>
        </div>
      </Flex>
      <div className={classnames('mdhtml', styles.html)} dangerouslySetInnerHTML={{ __html: props.html }}></div>
    </Space>
  </div>
}

function ListB(props: React.PropsWithoutRef<TCommentState & { reload: () => void }>) {
  return <div className={styles.container}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Flex block gap={8}>
        <Avatar src={props.user.avatar} shape="square" size="large" />
        <div className={styles.user}>
          <div className={styles.nickname}>{props.user.nickname}</div>
          <div className={styles.tips}>
            发表于：{dayjs(props.ctime).format('YYYY-MM-DD HH:mm:ss')}
            <Divider type="vertical" />
            来自：{props.ip}
            <Divider type="vertical" />
            <DeleteComment id={props.id} reload={props.reload} />
          </div>
        </div>
      </Flex>
      <div className={classnames('mdhtml', styles.html)} dangerouslySetInnerHTML={{ __html: props.html }}></div>
      <div className={styles.reply}>
        {
          !!props.replies && !!props.replies.length && props.replies.map(reply => {
            return <ListB {...reply} key={reply.id} reload={props.reload} />
          })
        }
      </div>
    </Space>
  </div>
}

function DeleteComment(props: React.PropsWithoutRef<{ id: number, reload: () => void }>) {
  const { execute, loading } = useAsyncCallback(deleteComment);
  const submit = useCallback(() => {
    execute(props.id)
      .then(props.reload)
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message));
  }, [])
  return <Popconfirm
    title="确定删除这条评论？"
    onConfirm={submit}
    okText="取消"
    cancelText="确定"
  ><Typography.Link disabled={loading}>删除</Typography.Link></Popconfirm>
}