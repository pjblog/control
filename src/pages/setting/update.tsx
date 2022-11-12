import { useAsyncCallback } from '@codixjs/fetch';
import { Typography, message } from 'antd';
import React, { useCallback } from 'react';
import { checkUpdate } from '../../service';

export function CheckUpdate(props: React.PropsWithoutRef<{ name: string }>) {
  const { loading, execute } = useAsyncCallback(checkUpdate);
  const submit = useCallback(() => {
    execute(props.name)
      .then((r) => r 
        ? message.warn('此模块存在可用更新')
        : message.success('此模块不需要更新')
      )
      .catch(e => message.error(e.message));
  }, [props.name])
  return <Typography.Link disabled={loading} onClick={submit}>检查更新</Typography.Link>
}