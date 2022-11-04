import React, { useEffect } from 'react';
import { AdminUserInfoContext } from './context';
import { getAdminInfo, useBaseRequestConfigs } from '../service';
import { Forbiden, Exception } from '../components';
import { Login } from './login';
import { useAsync } from '@codixjs/fetch';
import { eventEmitter } from '@codixjs/codix';
export function LayoutProvider(props: React.PropsWithChildren<{}>) {
  const configs = useBaseRequestConfigs();
  const { data, error, execute } = useAsync('admin', () => getAdminInfo(configs));
  useEffect(() => {
    eventEmitter.on('reload' as any, execute);
    return () => eventEmitter.off('reload' as any, execute);
  }, [execute])
  if (error) {
    switch (error.code) {
      case 401: return <Login />;
      case 403: return <Forbiden />;
      default: return <Exception message={error.message} />
    }
  }
  return <AdminUserInfoContext.Provider value={data}>{props.children}</AdminUserInfoContext.Provider>
}