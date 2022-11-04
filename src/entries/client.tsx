import 'antd/dist/antd.css';
import '../style.less';
import React from 'react';
import NotFound from '../components/404';
import { Application, PopstateHistoryMode } from '@codixjs/codix';
import createRouters from '../pages/index';
import { hydrateRoot } from 'react-dom/client';

const app = new Application(PopstateHistoryMode, import.meta.env.BASE_URL);
export const routers = createRouters(app);
const { Bootstrap } = app.build();

window.onload = () => {
  hydrateRoot(
    document.getElementById('root'),
    <Bootstrap pathes={routers}><NotFound /></Bootstrap>
  );
}
