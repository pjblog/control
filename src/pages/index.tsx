import { Application, HistoryMode } from '@codixjs/codix';
import { Client, ClientProvider } from '@codixjs/fetch';
import { Loading } from '../components';
import { withLayout } from '../withes';

export default function createRouters(app: Application<HistoryMode>) {
  const client = new Client();
  if (typeof window !== 'undefined' && window.INITIALIZE_STATE) {
    client.initialize(window.INITIALIZE_STATE);
  }
  // fetch client
  app.use(ClientProvider, { client });
  
  // 主页
  const HOME = app.bind('/', ...withLayout({ 
    fallback: <Loading size={36} />,
    title: '欢迎',
    sidebar: true,
  }, () => import('./home')));

  // 设置
  const SETTING = app.bind('/setting', ...withLayout({
    fallback: <Loading size={36} />,
    title: '全局',
    sidebar: true,
  }, () => import('./setting')));

  // 分类
  const CATEGORY = app.bind('/category', ...withLayout({
    fallback: <Loading size={36} />,
    title: '配置',
    sidebar: true,
  }, () => import('./category')));

  // 文章列表
  const ARTICLE = app.bind('/article', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./article')));

  // 新建文章
  const NEW_ARTICLE = app.bind('/article/post', ...withLayout({
    fallback: <Loading size={36} />,
    title: '新建',
    sidebar: false,
  }, () => import('./article/post')));

  // 更新文章
  const MODIFY_ARTICLE = app.bind<{ id: number }>('/article/post/:id(\\d+)', ...withLayout({
    fallback: <Loading size={36} />,
    title: '更新',
    sidebar: false,
  }, () => import('./article/post')));

  // 评论
  const COMMENT = app.bind('/comment', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./comment')));

  // 用户
  const USER = app.bind('/user', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./user')));

  // 友情链接
  const LINK = app.bind('/link', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./link')));

  // 主题
  const THEME = app.bind('/theme', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./theme')));

  // 插件
  const PLUGIN = app.bind('/plugin', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./plugin')));

  return {
    HOME,
    SETTING,
    CATEGORY,
    ARTICLE,
    COMMENT,
    NEW_ARTICLE,
    MODIFY_ARTICLE,
    USER,
    LINK,
    THEME,
    PLUGIN,
    client,
  }
}