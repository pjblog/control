import { useAsyncCallback } from '@codixjs/fetch';
import { Typography, Popconfirm, message } from 'antd';
import React, { useCallback } from 'react';
import { setTheme } from '../../service';

export function Active(props: React.PropsWithoutRef<{ name: string, reload: () => void }>) {
  const { loading, execute } = useAsyncCallback(setTheme);
  const submit = useCallback(() => {
    execute(props.name)
      .then(props.reload)
      .then(() => message.success('主题启用成功'))
      .catch(e => message.error(e.message));
  }, [props.name])
  return <Popconfirm
    title="确定启用这个主题？"
    onConfirm={submit}
    okText="确定"
    cancelText="取消"
  >
   <Typography.Link disabled={loading}>启用</Typography.Link>
  </Popconfirm>
}