import { ServerSiderRender } from '@codixjs/server';
import Html from './html';
import createRouters from './pages';

export default ServerSiderRender({
  prefix: import.meta.env.BASE_URL,
  html: Html,
  routers: createRouters,
  onAllReady(stream, obj) {
    const client = obj.client;
    stream.write(`<script>window.INITIALIZE_STATE = ${JSON.stringify(client.toJSON())}</script>`);
  }
})