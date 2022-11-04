import { ServerSiderRender } from '@codixjs/server';
import Html from '../html';
import createRouters from '../pages/index';

export default ServerSiderRender({
  prefix: import.meta.env.BASE_URL,
  html: Html,
  routers: createRouters,
  onAllReady(req, res, obj) {
    const client = obj.client;
    res.write(`<script>window.INITIALIZE_STATE = ${JSON.stringify(client.toJSON())}</script>`);
  }
})