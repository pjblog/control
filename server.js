const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const clientDictionary = path.resolve(__dirname, 'dist', 'ssr', 'client');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = 8080;

(async () => {
  const { getAssets } = await import('@codixjs/vite');
  const render = await import('./dist/ssr/server/server.mjs');
  return {
    assets: await getAssets(render.default.prefix, 'src/entries/client.tsx', clientDictionary),
    runner: render.default.middleware,
    prefix: render.default.prefix,
  }
})().then(({ assets, runner, prefix }) => {
  const app = express();
  app.use(prefix, serveStatic(clientDictionary));
  app.use(createProxyMiddleware('/api', {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  }))
  app.get(prefix + '*', (req, res, next) => {
    req.HTMLAssets = assets;
    req.HTMLStates = {};
    runner(req, res, next);
  })
  app.listen(port, err => {
    if (err) throw err;
    console.log('ready on localhot:' + port);
  })
}).catch(e => {
  console.log('发生错误，无法启动服务器:', e.message);
})

