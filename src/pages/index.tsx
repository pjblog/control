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

  const POST_ARTICLE = app.bind(
    '/articles/post', 
    withMiddleware(WebSocket, { room: '/article' }), 
    ...withImport(() => import('./articles/post'))
  );

  const EDIT_ARTICLE = app.bind<{ id: number }>(
    '/articles/post/:id(\\d+)', 
    withMiddleware(WebSocket, { 
      room: req => `/article/${req.params.id}` 
    }), 
    ...withImport(() => import('./articles/post')),
  );

  const WIDGETS = app.bind(
    '/widgets', 
    withMiddleware(WebSocket, { room: '/widgets' }), 
    ...withImport(() => import('./widgets'))
  );

  const routes = {
    HOME,
    CONFIGS,
    CATEGORIES,
    ARTICLES,
    POST_ARTICLE,
    EDIT_ARTICLE,
    USERS,
    WIDGETS,
  }
  
  return Object.assign(routes, { client });
}