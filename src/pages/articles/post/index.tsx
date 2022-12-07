import classNames from 'classnames';
import styles from './index.module.less';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Flex, useGetAsync, Tags, useSocket, request } from "@pjblog/control-hooks";
import { Button, Input, Space, Divider, Select, Drawer, Result, message } from 'antd';
import { Fragment, PropsWithoutRef, useCallback, useEffect, useMemo, useState } from 'react';
import { ICategoryUnOutabled } from '../types';
import { useRequestParam } from '@codixjs/codix';
import { numberic } from '../../../utils';
import { usePath } from '../../../hooks';
import { useAsyncCallback, useClient } from '@codixjs/fetch';

interface IResponse {
  title: string,
  content: string,
  category: number,
  tags: string[],
  summary: string,
}

export default function Page() {
  const AritlcesPather = usePath('ARTICLES');
  const id = useRequestParam('id', numberic(0)) as number;
  const { data, error, execute } = useGetAsync<IResponse>({ url: '/-/article/' + id }, [id]);
  const [value, setValue] = useState<string>(data?.content || '');
  const [title, setTitle] = useState<string>(data?.title || '');
  const [category, setCategory] = useState(data?.category || 0);
  const [tags, setTags] = useState<string[]>(data?.tags || []);
  const [summary, setSummary] = useState(data?.summary || '');

  useEffect(() => {
    setValue(data?.content || '');
    setTitle(data?.title || '');
    setCategory(data?.category || 0);
    setTags(data?.tags || []);
    setSummary(data?.summary || '');
  }, [data?.content, data?.title, data?.category, data?.tags, data?.summary]);

  if (error?.code) return <Result
    status={error.code}
    title={error.code}
    subTitle={error.message}
    extra={<Button type="primary" onClick={() => AritlcesPather.redirect()}>返回</Button>}
  />


  return <Flex block full direction="vertical" scroll="hide">
    <Flex className={styles.toolbar} block align="between" valign="middle">
      <Flex gap={8} align="left" valign="middle">
        <Tags 
          value={tags} 
          options={{ direction: 'horizontal', text: '新标签', placeholder:'标签...' }}
          onChange={setTags}
        />
      </Flex>
      <Space>
        <Categories value={category} setValue={setCategory} />
        <Summary value={summary} setValue={setSummary} />
        <Submit value={value} id={id} title={title} category={category} tags={tags} summary={summary} reload={execute} />
      </Space>
    </Flex>
    <Flex className={classNames(styles.toolbar, styles.title)} block align="between" valign="middle" gap={24}>
      <Flex span={1}>
        <Input
          autoFocus
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          bordered={false} 
          placeholder="请输入文章标题" 
        />
      </Flex>
      <div className={styles.extras}>
        <span>字数：{value?.length} 个</span>
        <Divider type="vertical" />
        <span>行数：{value?.split('\n').length} 行</span>
      </div>
    </Flex>
    <Flex className={styles.content} span={1} block>
      <Flex span={1} full scroll="hide">
        <div className={styles.editor}>
          <CodeMirror 
            minHeight="100%"
            value={value} 
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
            onChange={e => setValue(e)} 
            placeholder="请输入日志内容..."
          />
        </div>
      </Flex>
      <Preview value={value} />
    </Flex>
  </Flex>
}

function Categories(props: PropsWithoutRef<{
  value: number,
  setValue: (val: number) => void,
  width?: number | string,
}>) {
  const { data } = useGetAsync<ICategoryUnOutabled[]>({ url: '/-/category/unoutabled' });
  const dataSource = useMemo(() => {
    const defaultOptions = [{
      label: '请选择分类',
      value: 0,
    }];
    return defaultOptions.concat(data.map(value => {
      return {
        label: value.name,
        value: value.id
      }
    }))
  }, [data])
  return <Select 
    options={dataSource} 
    value={props.value} 
    onChange={e => props.setValue(e)} 
    style={{
      width: props.width
    }} 
  />
}

function Preview(props: PropsWithoutRef<{ value: string }>) {
  const socket = useSocket();
  const [html, setHTML] = useState<string>(null);
  useEffect(() => {
    if (props.value && socket) {
      const handler = (html: string) => setHTML(html);
      socket.on('markdown', handler);
      socket.emit('markdown', props.value);
      return () => {
        socket.off('markdown', handler);
      }
    }
  }, [props.value, socket])
  return <Flex span={1} full scroll="hide">
    <div className={styles.preview}>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  </Flex>
}

function Summary(props: PropsWithoutRef<{
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
}>) {
  const [open, setOpen] = useState(false);
  return <Fragment>
    <Button danger onClick={() => setOpen(true)}>摘要</Button>
    <Drawer title="编辑本文摘要" placement="right" onClose={() => setOpen(false)} open={open} width="50%">
      <CodeMirror 
        minHeight="100%"
        value={props.value} 
        extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
        onChange={e => props.setValue(e)} 
        placeholder="请输入摘要内容..."
      />
    </Drawer>
  </Fragment>
}

function Submit(props: PropsWithoutRef<{
  id: number,
  value: string,
  title: string,
  category: number,
  tags: string[],
  summary: string,
  reload: () => void
}>) {
  const client = useClient();
  const ArticlesPather = usePath('ARTICLES');
  const { id, value, title, category, tags, summary } = props;
  const { execute, loading } = useAsyncCallback(async () => {
    const res = await request.post('/-/article/' + id, {
      title,
      content: value,
      category,
      tags,
      summary,
    })
    return res.data;
  })
  const postable = useMemo(() => {
    if (!value) return false;
    if (!title) return false;
    if (category <= 0) return false;
    if (!summary) return false;
    return true;
  }, [value, title, category, summary]);
  const submit = useCallback(() => {
    execute()
      .then(props.reload)
      .then(() => client.reload('articles'))
      .then(() => message.success('保存成功'))
      .then(() => ArticlesPather.redirect())
      .catch(e => message.error(e.message));
  }, [execute])
  return <Button type="primary" disabled={!postable} loading={loading} onClick={submit}>保存</Button>
}