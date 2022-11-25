import { useAsyncCallback } from '@codixjs/fetch';
import { Button, Popconfirm, message } from 'antd';
import React, { useCallback } from 'react';
import { usePath } from '../../../hooks';
import { uninstall } from '../../../service';

export function UnInstall(props: React.PropsWithoutRef<{ 
  name: string,
  disabled?: boolean 
}>) {
  const THEME = usePath('THEME');
  const { loading, execute } = useAsyncCallback(uninstall);
  const submit = useCallback(() => {
    execute(props.name)
      .then(() => message.success('卸载成功，正在返回'))
      .then(() => THEME.redirect())
      .catch(e => message.error(e.message));
  }, [props.name])
  return <Popconfirm
    title="确定卸载这个主题？"
    onConfirm={submit}
    okText="确定"
    cancelText="取消"
    disabled={props.disabled}
  >
   <Button danger loading={loading} disabled={props.disabled}>卸载</Button>
  </Popconfirm>
}