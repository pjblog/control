import { Result, Button } from 'antd';
import React from 'react';
import { usePath } from '../../hooks';
export function Exception(props: React.PropsWithoutRef<{ message: string }>) {
  const HOME = usePath('HOME');
  return <Result
    status="500"
    title="500"
    subTitle={props.message}
    extra={
      <Button 
        type="primary" 
        onClick={() => HOME.redirect()}
      >返回首页</Button>
    }
  />
}