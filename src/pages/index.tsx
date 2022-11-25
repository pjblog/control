import { Application, HistoryMode, withMiddleware } from '@codixjs/codix';
import { Client, ClientProvider } from '@codixjs/fetch';
import { Loading, WebSocket } from '../components';
import { withLayout } from '../withes';

export default function createRouters(app: Application<HistoryMode>) {
  const client = new Client();
  if (typeof window !== 'undefined' && window.INITIALIZE_STATE) {
    client.initialize(window.INITIALIZE_STATE);
  }
  // fetch client
  app.use(ClientProvider, { client });
  
  // 主页
  const WELCOME = app.bind('/', ...withLayout({ 
    fallback: <Loading size={36} />,
    title: '大盘',
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
  const NEW_ARTICLE = app.bind(
    '/article/post', 
    withMiddleware(WebSocket, { room: '/markdown' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '新建',
      sidebar: false,
    }, () => import('./article/post'))
  );

  // 更新文章
  const MODIFY_ARTICLE = app.bind<{ id: number }>(
    '/article/post/:id(\\d+)', 
    withMiddleware(WebSocket, { room: '/markdown' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '更新',
      sidebar: false,
    }, () => import('./article/post'))
  );

  // 评论
  const COMMENT = app.bind('/comment', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./comment')));
  const ARTICLE_COMMENT = app.bind<{ id: number }>('/comment/:id(\\d+)', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./comment')));

  // 单页
  const PAGE = app.bind('/page', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./page')));

  // 新建文章
  const NEW_PAGE = app.bind(
    '/page/post', 
    withMiddleware(WebSocket, { room: '/markdown' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '新建',
      sidebar: false,
    }, () => import('./page/post'))
  );

  // 更新文章
  const MODIFY_PAGE = app.bind<{ id: number }>(
    '/page/post/:id(\\d+)', 
    withMiddleware(WebSocket, { room: '/markdown' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '新建',
      sidebar: false,
    }, () => import('./page/post'))
  );

  // 用户
  const USER = app.bind('/user', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./user')));

  const VISITOR = app.bind('/user/visitors', ...withLayout({
    fallback: <Loading size={36} />,
    title: '访客列表',
    sidebar: true,
  }, () => import('./user/visitor')));

  // 友情链接
  const LINK = app.bind('/link', ...withLayout({
    fallback: <Loading size={36} />,
    title: '列表',
    sidebar: true,
  }, () => import('./link')));

  // 主题
  const THEME = app.bind('/theme', 
    withMiddleware(WebSocket, { room: '/modularing' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '列表',
      sidebar: true,
    }, () => import('./theme'))
  );

  // 插件详情
  const MODULE_DETAIL = app.bind<{ name: string }>('/module/:name', 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '详细',
      sidebar: true,
    }, () => import('./module/detail'))
  );

  // 插件
  const PLUGIN = app.bind('/plugin', 
    withMiddleware(WebSocket, { room: '/modularing' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '列表',
      sidebar: true,
    }, () => import('./plugin'))
  );
  
  // 模块
  const MODULE = app.bind('/module', 
    withMiddleware(WebSocket, { room: '/installing' }), 
    ...withLayout({
      fallback: <Loading size={36} />,
      title: '列表',
      sidebar: true,
    }, () => import('./module'))
  );

  return {
    WELCOME,
    SETTING,
    CATEGORY,
    ARTICLE,
    COMMENT,
    PAGE,
    NEW_PAGE,
    MODIFY_PAGE,
    ARTICLE_COMMENT,
    NEW_ARTICLE,
    MODIFY_ARTICLE,
    USER,
    VISITOR,
    LINK,
    THEME,
    MODULE_DETAIL,
    PLUGIN,
    MODULE,
    client,
  }
}