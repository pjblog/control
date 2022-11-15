import { useAsyncCallback } from '@codixjs/fetch';
import { Typography, Popconfirm, message } from 'antd';
import React, { useCallback } from 'react';
import { uninstallPlugin } from '../../service';

export function UnInstall(props: React.PropsWithoutRef<{ name: string, onDelete?: () => void }>) {
  const { loading, execute } = useAsyncCallback(uninstallPlugin);
  const submit = useCallback(() => {
    execute(props.name)
      .then(() => message.success('卸载成功'))
      .then(() => {
        if (typeof props.onDelete === 'function') {
          return props.onDelete();
        }
      })
      .catch(e => message.error(e.message));
  }, [props.name])
  return <Popconfirm
    title="确定卸载这个插件？"
    onConfirm={submit}
    okText="确定"
    cancelText="取消"
  >
   <Typography.Link disabled={loading}>卸载</Typography.Link>
  </Popconfirm>
}