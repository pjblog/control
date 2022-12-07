import { Application, HistoryMode, withImport, withMiddleware } from '@codixjs/codix';
import { Client, ClientProvider } from '@codixjs/fetch';
import { Provider, WebSocket } from '@pjblog/control-hooks';

export default function createRouters(app: Application<HistoryMode>) {
  const client = new Client();
  if (typeof window !== 'undefined' && window.INITIALIZE_STATE) {
    client.initialize(window.INITIALIZE_STATE);
  }
  // fetch client
  app.use(ClientProvider, { client });
  app.use(Provider);
  
  // 主页
  const HOME = app.bind('/', ...withImport(() => import('./home')));
  const CONFIGS = app.bind('/configs', ...withImport(() => import('./configs')));
  const CATEGORIES = app.bind('/categories', ...withImport(() => import('./categories')));
  const ARTICLES = app.bind('/articles', ...withImport(() => import('./articles')));
  const USERS = app.bind('/users', ...withImport(() => import('./users')));
  const THEMES = app.bind('/themes', ...withImport(() => import('./themes')));
  const PLUGINS = app.bind('/plugins', ...withImport(() => import('./plugins')));
  const WIDGETS = app.bind('/widgets', ...withImport(() => import('./widgets')));

  const POST_ARTICLE = app.bind(
    '/articles/post', 
    withMiddleware(WebSocket, { room: '/article' }), 
    ...withImport(() => import('./articles/post'))
  );

  const EDIT_ARTICLE = app.bind<{ id: number }>(
    '/articles/post/:id(\\d+)', 
    withMiddleware(WebSocket, { room: '/article' }), 
    ...withImport(() => import('./articles/post')),
  );

  const routes = {
    HOME,
    CONFIGS,
    CATEGORIES,
    ARTICLES,
    POST_ARTICLE,
    EDIT_ARTICLE,
    USERS,
    THEMES,
    PLUGINS,
    WIDGETS,
  }
  
  return Object.assign(routes, { client });
}