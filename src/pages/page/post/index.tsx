import styles from '../../article/post/index.module.less';
import CodeMirror from '@uiw/react-codemirror';
import classnames from 'classnames';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useRequestParam } from "@codixjs/codix";
import { useAsync, useAsyncCallback, useClient } from "@codixjs/fetch";
import { Flex, useSocket } from "../../../components";
import { useBaseRequestConfigs } from "../../../service";
import { addNewPage, getPage, updatePage } from "../../../service/page";
import { numberic } from "../../../utils";
import { Tooltip, Input, Space, Button, Dropdown, Segmented, Divider, message, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { usePath } from '../../../hooks';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
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

export default function PagePostPage() {
  const configs = useBaseRequestConfigs();
  const socket = useSocket();
  const client = useClient();
  const PAGE = usePath('PAGE');
  const id = useRequestParam('id', numberic(0)) as number;
  const { data, execute, error } = useAsync('page:' + id, () => getPage(id, configs), [id]);
  const [title, setTitle] = useState<string>(data?.code || '');
  const [value, setValue] = useState<string>(data?.content || '');
  const [viewHTML, setViewHTML] = useState(false);

  const [preview, setPreview] = useState<TPreview>({
    headings: [],
    html: '',
    summary: ''
  })

  const previewValue = useDeferredValue(value);
  const html = preview.html || '';
  const headings = preview.headings;

  const canPost = useMemo(() => {
    if (title?.length && title.length <= 32 && /^[\w\d\_\-]+$/.test(title) && !!value?.length) return true;
    return false;
  }, [title, value]);

  const newPageRef = useAsyncCallback(() => addNewPage(title, value));
  const updatePageRef = useAsyncCallback(() => updatePage(id, title, value));

  const saving = useMemo(() => newPageRef.loading || updatePageRef.loading, [newPageRef.loading, updatePageRef.loading]);

  const menus = headings.map(heading => {
    return {
      label: <span style={{ paddingLeft: (heading.level - 1) * 24 }}>[{heading.level}] {heading.text}</span>,
      key: heading.id,
    }
  })

  const submit = () => {
    if (!title.length) return message.warn('单页标识不能为空');
    if (title.length > 32) return message.warn('单页标识不能大于32个字符');
    if (!value.length) return message.warn('请输入单页内容');
    if (id > 0) {
      updatePageRef.execute()
        .then(() => client.reload('pages'))
        .then(execute)
        .then(() => message.success('更新单页成功，正在返回单页列表'))
        .then(() => PAGE.redirect())
        .catch(e => message.error(e.message));
    } else {
      newPageRef.execute()
        .then(() => client.reload('pages'))
        .then(() => message.success('发布单页成功，正在返回单页列表'))
        .then(() => PAGE.redirect())
        .catch(e => message.error(e.message));
    }
  }

  // 预览markdown内容
  useEffect(() => {
    if (socket) {
      const handler = (text: TPreview) => setPreview(text);
      socket.on('markdown', handler);
      return () => {
        socket.off('markdown', handler);
      }
    }
  }, [socket])

  // 编译markdown内容
  useEffect(() => {
    if (socket) {
      socket.emit('markdown', previewValue);
    }
  }, [previewValue, socket])


  useEffect(() => {
    setTitle(data?.code || '');
    setValue(data?.content || '');
  }, [data?.code, data?.content])

  if (error?.code) return <Result
    status={error.code}
    title={error.code}
    subTitle={error.message}
    extra={<Button type="primary" onClick={() => PAGE.redirect()}>返回</Button>}
  />

  return <Flex block full scroll="hide" direction="vertical" className={styles.editor}>
    <Flex block className={styles.editorTitle} valign="middle">
      <Tooltip title="返回单页列表" placement="right"><ArrowLeftOutlined className={styles.back} onClick={() => PAGE.redirect()} /></Tooltip>
      <Flex span={1} align="between" valign="middle" gap={24} block>
        <Flex span={1} direction="vertical">
          <div className={styles.label}>单页标识 仅允许 英文数字以及下划线</div>
          <Input 
            placeholder="请输入单页标识" 
            size="large" bordered={false} 
            className={styles.title} 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            prefix={<span className={styles.titlePrefix}>/ PAGES /</span>}
          />
        </Flex>
        <Space>
          <Button type="primary" disabled={!canPost} loading={saving} onClick={submit}>保存</Button>
        </Space>
      </Flex>
    </Flex>
    <Flex className={styles.editorContent} span={1} block>
      <Flex span={1} direction="vertical" scroll="hide" full>
        <Flex className={styles.tip} align="between" valign="middle">
          <Button type="text">编辑区</Button>
        </Flex>
        <Flex span={1} block scroll="y">
          <div className={styles.content}>
            <CodeMirror 
              height="100%"
              value={value} 
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
              onChange={e => setValue(e)} 
              placeholder="请输入单页内容..."
            />
          </div>
        </Flex>
      </Flex>
      <Flex span={1} direction="vertical" scroll="hide" full>
        <Flex className={styles.tip} align="between" valign="middle">
          <Dropdown.Button menu={{ items: menus, onClick: e => goMarked(e.key) }} type="text">预览区</Dropdown.Button>
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
    <Flex className={styles.editorTools} block align="center" valign="middle">
      <div>
        <span>字数：{value?.length}个</span>
        <Divider type="vertical" />
        <span>行数：{value?.split('\n').length}行</span>
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