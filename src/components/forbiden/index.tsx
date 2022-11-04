import React from 'react';
import { Result, Button } from 'antd';
import { usePath } from '../../hooks';
export function Forbiden() {
  const HOME = usePath('HOME');
  return <Result
    status="403"
    title="403"
    subTitle="您不是超级管理员，无法访问！"
    extra={
      <Button 
        type="primary" 
        onClick={() => HOME.redirect()}
      >返回首页</Button>
    }
  />
}