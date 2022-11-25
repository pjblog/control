import React, { useCallback } from 'react';
import { useAsyncCallback, useClient } from '@codixjs/fetch';
import { Popconfirm, message, Button } from 'antd';
import { setTheme } from '../../../service';

export function Active(props: React.PropsWithoutRef<{ 
  name: string, 
  reload: () => void,
  disabled?: boolean 
}>) {
  const client = useClient();
  const { loading, execute } = useAsyncCallback(setTheme);
  const submit = useCallback(() => {
    execute(props.name)
      .then(props.reload)
      .then(() => client.reload('theme'))
      .then(() => message.success('主题启用成功'))
      .catch(e => message.error(e.message));
  }, [props.name])
  return <Popconfirm
    title="确定启用这个主题？"
    onConfirm={submit}
    okText="确定"
    cancelText="取消"
    disabled={props.disabled}
  >
   <Button type="primary" disabled={props.disabled} loading={loading}>启用</Button>
  </Popconfirm>
}