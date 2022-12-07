import styles from './index.module.less';
import classnames from 'classnames';
import { Flex, useGetAsync, Loading, request } from "@pjblog/control-hooks";
import { IArticle, ICategoryUnOutabled } from './types';
import { Fragment, PropsWithoutRef, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Space, Typography, Avatar, Tag, Pagination, Input, Empty, FloatButton, Tooltip, Anchor, message, Popconfirm } from 'antd';
import { EyeFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePath } from '../../hooks';
import { useAsyncCallback } from '@codixjs/fetch';

interface IState {
  id: string,
  name: string,
  level: number,
  children?: IState[],
}

const { Link } = Anchor;

export default function Page() {
  const [category, setCategory] = useState(-1);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { data: { total, dataSource }, execute } = useGetAsync<{ total: number, dataSource: IArticle[] }>({
    id: 'articles',
    url: '/-/article',
    querys: { category, keyword, page, size }
  }, [category, keyword, page, size])
  const [preview, setPreview] = useState<IArticle>(dataSource.length ? dataSource[0] : null);
  useEffect(() => setPage(1), [category, keyword]);
  useEffect(() => {
    if (dataSource.length) {
      setPreview(dataSource[0]);
    } else {
      setPreview(null);
    }
  }, [dataSource])
  return <Flex block full direction="vertical">
    <Suspense fallback={<Loading />}><Categories value={category} setValue={setCategory} /></Suspense>
    <Flex block scroll="both" span={1}>
      <div className={styles.list}>
        <div className={styles.keyword}>
          <Input 
            autoFocus
            onPressEnter={e => setKeyword(e.currentTarget.value)} 
            bordered={false} size="large" 
            placeholder="请输入搜索文章的关键字..."  
            onChange={e => {
              if (!e.target.value || !e.target.value.trim()) {
                setKeyword(null);
              }
            }}
          />
        </div>
        {
          !!dataSource.length
            ? dataSource.map(data => <Article 
                article={data} 
                key={data.id} 
                actived={preview ? preview.id === data.id : false} 
                setter={setPreview}
              />)
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        <Flex block className={styles.pages} align="center">
          <Pagination total={total} current={page} pageSize={size} size="small" onChange={(p, s) => {
            setPage(p);
            setSize(s);
          }} />
        </Flex>
      </div>
      <Flex className={styles.preview} block full scroll="y" id="scroller">
        {!!preview && <Preview {...preview} reload={execute} />}
      </Flex>
    </Flex>
  </Flex>
}

function Categories(props: PropsWithoutRef<{
  value: number,
  setValue: (val: number) => void,
}>) {
  const { data } = useGetAsync<ICategoryUnOutabled[]>({ 
    id: 'unOutabledCategories',
    url: '/-/category/unoutabled' 
  });
  const total = useMemo(() => data.reduce((prev, next) => prev + Number(next.count), 0), [data])
  return <Flex className={styles.categories} block align="left" valign="middle" gap={16}>
    <Tag.CheckableTag checked={props.value === -1} onClick={() => props.setValue(-1)}>全部({total})</Tag.CheckableTag>
    {
      data.map(category => {
        return <Tag.CheckableTag 
          key={category.id} 
          checked={category.id === props.value}
          onClick={() => props.setValue(category.id)}
        >{category.name}({category.count})</Tag.CheckableTag>
      })
    }
    <Tag.CheckableTag checked={props.value === 0} onClick={() => props.setValue(0)}>回收站</Tag.CheckableTag>
  </Flex>
}

function Article(props: PropsWithoutRef<{ actived: boolean, article: IArticle, setter: React.Dispatch<React.SetStateAction<IArticle>> }>) {
  return <div className={classnames(styles.article, {
    [styles.active]: props.actived
  })} onClick={() => props.setter(props.article)}>
    <div className={styles.inner}>
      <Typography.Paragraph ellipsis className={styles.title}>{props.article.title}</Typography.Paragraph>
      <Typography.Paragraph ellipsis={{ rows: 4 }} className={styles.summary}>{props.article.summary}</Typography.Paragraph>
      <Flex align="between" className={styles.top}>
        <Space size={4} className={styles.user}><Avatar src={props.article.user.avatar} size={16} />{props.article.user.nickname}</Space>
        <Space size={4} className={styles.read}><EyeFilled />{props.article.readCount}</Space>
      </Flex>
      <Flex block align="right">
        <Space>
          {props.article.tags.map(tag => <Typography.Text key={tag.id} className={styles.tag}>{tag.name}</Typography.Text>)}
        </Space>
      </Flex>
    </div>
  </div>
}

function Preview(props: PropsWithoutRef<IArticle & { reload: () => void }>) {
  const EditPather = usePath('EDIT_ARTICLE');
  const dataSource = useMemo(() => formatHeadings(props.headings), [props.headings]);
  const { execute, loading } = useAsyncCallback(async () => {
    const res = await request.delete('/-/article/' + props.id);
    return res.data;
  })
  const submit = useCallback(() => {
    if (loading) return;
    execute()
      .then(props.reload)
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message))
  }, [execute, props.reload, loading]);
  return <Flex className={styles.wrap} gap={24}>
    <FloatButton.Group shape="circle" style={{ right: 24 }}>
      <Tooltip title="编辑" placement="left"><FloatButton icon={<EditOutlined />} onClick={() => EditPather.redirect({ id: props.id })} /></Tooltip>
      <Tooltip title="删除" placement="left">
        <Popconfirm
          title="确定删除此文章？"
          onConfirm={submit}
          okText="删除"
          cancelText="取消"
        ><FloatButton icon={<DeleteOutlined />} /></Popconfirm>
      </Tooltip>
    </FloatButton.Group>
    <div className="markdown">
      <Typography.Title level={1}>{props.title}</Typography.Title>
      <div dangerouslySetInnerHTML={{ __html: props.html }}></div>
    </div>
    <Anchor affix getContainer={() => document.getElementById('scroller')} offsetTop={24}>
      <Links dataSource={dataSource} />
    </Anchor>
  </Flex>
}

export function formatHeadings(dataSource: IArticle['headings']) {
  if (!dataSource?.length) return [];
  let level: number = dataSource[0].level;
  const pools: IState[] = [];
  const indexs: number[] = [];

  for (let i = 0; i < dataSource.length; i++) {
    const chunk = dataSource[i];
    const children = getByIndex(pools, indexs);

    if (chunk.level > level) {
      indexs.push(children.length - 1);
      const _children = getByIndex(pools, indexs);
      _children.push({
        id: chunk.id,
        name: chunk.text,
        level: chunk.level,
        children: [],
      });
    } else if (chunk.level < level) {
      indexs.pop();
      const _children = getByIndex(pools, indexs);
      _children.push({
        id: chunk.id,
        name: chunk.text,
        level: chunk.level,
        children: [],
      });
    } else {
      children.push({
        id: chunk.id,
        name: chunk.text,
        level: chunk.level,
        children: [],
      });
    }
    
    level = chunk.level;
  }

  return pools
}

function getByIndex(pools: IState[], indexs: number[]) {
  if (!indexs.length) return pools;
  let res = pools;
  for (let i = 0; i < indexs.length; i++) {
    res = res[indexs[i]].children;
  }
  return res;
}

export function Links(props: PropsWithoutRef<{ dataSource: IState[] }>) {
  if (!props.dataSource.length) return;
  return <Fragment>
    {
      props.dataSource.map(chunk => {
        return <Link href={'#' + chunk.id} title={chunk.name} key={chunk.id}>
          <Links dataSource={chunk.children} />
        </Link>
      })
    }
  </Fragment>
}