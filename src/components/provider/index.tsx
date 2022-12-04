import { PropsWithChildren, Suspense } from 'react';
import { Authorize } from '../authorize';
import { Loading } from '../loading';
import { Layout } from '../layout';

export function Provider(props: PropsWithChildren<{}>) {
  return <Suspense fallback={<Loading />}>
    <Authorize>
      <Layout>{props.children}</Layout>
    </Authorize>
  </Suspense>
}