import React from 'react';
import { Result, Button } from 'antd';
import { usePath } from '../../hooks';

export default function NotFound() {
  const HOME = usePath('HOME');
  return <Result
    status="404"
    title="404"
    subTitle="对不起，您访问的页面不存在！"
    extra={<Button type="primary" onClick={() => HOME.redirect()}>回首页</Button>}
  />
}