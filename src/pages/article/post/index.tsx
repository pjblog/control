import React, { useEffect, useMemo, useState, Suspense, useDeferredValue } from 'react';
import styles from './index.module.less';
import classnames from 'classnames';
import CodeMirror from '@uiw/react-codemirror';
import { useRequestParam } from '@codixjs/codix';
import { useAsync, useAsyncCallback, useClient } from '@codixjs/fetch';
import { Button, Space, Input, Tooltip, message, Divider, Dropdown, Popover, Empty, Segmented } from 'antd';
import { getArticle, useBaseRequestConfigs, TArticlePostData, addNewArticle, updateArticleById } from '../../../service';
import { numberic } from '../../../utils';
import { Flex, Loading, useSocket } from '../../../components';
import { CategorySelect } from './category';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { CheckOutlined, ArrowLeftOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Tags } from './tags';
import { usePath } from '../../../hooks';
import { SegmentedLabeledOption } from 'antd/lib/segmented';

interface THeading {
  id: string,
  level: number,
  text: string
}

interface TPreview {
  headings: THeading[],
  html: string,
  summary: string,
}

const viewMode: SegmentedLabeledOption[] = [
  {
    label: '代码模式',
    value: 1,
  },
  {
    label: '预览模式',
    value: 0,
  }
]

export default function ArticleBoxPage() {
  const configs = useBaseRequestConfigs();
  const socket = useSocket();
  const client = useClient();
  const Article = usePath('ARTICLE');
  const id = useRequestParam('id', numberic(0)) as number;
  const { data, execute } = useAsync('article:' + id, () => getArticle(id, configs), [id]);
  const [title, setTitle] = useState<string>(data.title);
  const [value, setValue] = useState<string>(data.content);
  const [viewHTML, setViewHTML] = useState(false);
  const [category, setCategory] = useState(data.category);
  const [tags, setTags] = useState<string[]>(data.tags);
  const [preview, setPreview] = useState<TPreview>({
    headings: [],
    html: '',
    summary: ''
  })

  const previewValue = useDeferredValue(value);
  const html = preview.html;
  const summary = preview.summary;
  const headings = preview.headings;
  const postData: TArticlePostData = {
    title, category, tags,
    content: value,
  }

  const canPost = useMemo(() => {
    if (title.length && title.length <= 255 && !!category && !!value.length && !!summary && summary.trim().length) return true;
    return false;
  }, [title, category, value, summary]);

  const newArticle = useAsyncCallback(() => addNewArticle(postData));
  const updateArticle = useAsyncCallback(() => updateArticleById(id, postData));
  const saving = useMemo(() => newArticle.loading || updateArticle.loading, [newArticle.loading, updateArticle.loading]);
  const path = usePath('ARTICLE');

  const submit = () => {
    if (!title.length) return message.warn('文章标题不能为空');
    if (title.length > 255) return message.warn('文章标题不能超过255个字符');
    if (!category) return message.warn('请选择分类后提交');
    if (!value.length) return message.warn('请输入文章内容');
    if (!summary) return message.warn('请输入摘要内容');
    if (id > 0) {
      updateArticle.execute()
        .then(() => client.reload('articles'))
        .then(() => client.reload('categories:unoutable'))
        .then(() => client.reload('categories'))
        .then(execute)
        .then(() => message.success('更新文章成功，正在返回文章列表'))
        .then(() => path.redirect())
        .catch(e => message.error(e.message));
    } else {
      newArticle.execute()
        .then(() => client.reload('articles'))
        .then(() => message.success('发布文章成功，正在返回文章列表'))
        .then(() => path.redirect())
        .catch(e => message.error(e.message));
    }
  }

  const menus = headings.map(heading => {
    return {
      label: <span style={{ paddingLeft: (heading.level - 1) * 24 }}>[{heading.level}] {heading.text}</span>,
      key: heading.id,
    }
  })

  useEffect(() => {
    if (socket) {
      const handler = (text: TPreview) => setPreview(text);
      socket.on('markdown', handler);
      return () => {
        socket.off('markdown', handler);
      }
    }
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.emit('markdown', previewValue);
    }
  }, [previewValue, socket])

  useEffect(() => {
    setTitle(data.title);
    setValue(data.content);
    setCategory(data.category);
    setTags(data.tags);
  }, [data.title, data.content, data.category, data.tags])

  return <Flex block full scroll="hide" direction="vertical" className={styles.editor}>
    <Flex block className={styles.editorTitle} valign="middle">
      <Tooltip title="返回文章列表" placement="right"><ArrowLeftOutlined className={styles.back} onClick={() => Article.redirect()} /></Tooltip>
      <Flex span={1} align="between" valign="middle" gap={24} block>
        <Flex span={1} direction="vertical">
          <div className={styles.label}><Tags value={tags} setValue={setTags} /></div>
          <Input placeholder="请输入文章标题" size="large" bordered={false} className={styles.title} value={title} onChange={e => setTitle(e.target.value)} />
        </Flex>
        <Space>
          <Suspense fallback={<Loading />}><CategorySelect value={category} setValue={setCategory} /></Suspense>
          <Button type="primary" disabled={!canPost} loading={saving} onClick={submit}>保存</Button>
        </Space>
      </Flex>
    </Flex>
    <Flex className={styles.editorContent} span={1} block>
      <Flex span={1} direction="vertical" scroll="hide" full>
        <Flex className={styles.tip} align="right" valign="middle">
          <Button type="primary">编辑区</Button>
        </Flex>
        <Flex span={1} block scroll="y">
          <div className={styles.content}>
            <CodeMirror 
              height="100%"
              value={value} 
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
              onChange={e => setValue(e)} 
              placeholder="请输入日志内容..."
            />
          </div>
        </Flex>
      </Flex>
      <Flex span={1} direction="vertical" scroll="hide" full>
        <Flex className={styles.tip} align="between" valign="middle">
          <Dropdown.Button menu={{ items: menus, onClick: e => goMarked(e.key) }} type="primary">预览区</Dropdown.Button>
          <Space className={styles.toolbar}>
            <Segmented options={viewMode} value={Number(viewHTML)} onChange={e => setViewHTML(Boolean(Number(e.toString())))} />
          </Space>
        </Flex>
        <Flex span={1} block scroll="y">
          {
            viewHTML
              ? <div className={classnames(styles.content, styles.source)}>
                  <pre>{html}</pre>
                </div>
              : <div className={classnames(styles.content, styles.html)} dangerouslySetInnerHTML={{ __html: html }}></div>
          }
        </Flex>
      </Flex>
    </Flex>
    <Flex className={styles.editorTools} block align="between" valign="middle">
      <div>
        <span style={{ marginRight: 12 }}>文章保存条件:</span>
        <Space>标题<CheckOutlined className={classnames(styles.checker, {
          [styles.allowed]: !!title.length
        })} /></Space>
        <Divider type="vertical" />
        <Space>内容<CheckOutlined className={classnames(styles.checker, {
          [styles.allowed]: !!value.length
        })} /></Space>
        <Divider type="vertical" />
        <Space>分类<CheckOutlined className={classnames(styles.checker, {
          [styles.allowed]: !!category
        })} /></Space>
        <Divider type="vertical" />
        <Space>摘要<CheckOutlined className={classnames(styles.checker, {
          [styles.allowed]: !!summary && summary.trim().length
        })} /></Space>
        <Divider type="vertical" />
        <strong>{ canPost ? '可以保存' : '不可保存'}</strong>
      </div>
      <div>
        <span>字数：{value.length}个</span>
        <Divider type="vertical" />
        <span>行数：{value.split('\n').length}行</span>
      </div>
    </Flex>
  </Flex>
}

function goMarked(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth'
    })
  }
}