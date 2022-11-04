import React, { Suspense } from 'react';
import { LayoutProvider } from './provider';
import { Loading } from '../components';
import { Sidebar } from './sidebar';
import { Content } from './content';
export function Layout(props: React.PropsWithChildren<{ sidebar?: boolean, title?: string }>) {
  return <Suspense fallback={<Loading size={16} />}>
    <LayoutProvider>
      {!!props.sidebar && <Sidebar />}
      <Content title={props.title} wide={!props.sidebar}>{props.children}</Content>
    </LayoutProvider>
  </Suspense>
}