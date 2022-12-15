import { Flex, useGetAsync } from '@pjblog/control-hooks';
import { Card, Typography } from 'antd';
import { PropsWithChildren } from 'react';
import styles from './index.module.less';

interface IItem {
  name: string,
  version: string,
}

interface IResponse {
  server: IItem,
  client: IItem,
  theme: IItem,
}

export function Versions() {
  const { data } = useGetAsync<IResponse>({
    id: 'versions',
    url: '/-/verions'
  })
  return <Card title="版本" size="small">
    <Flex block valign="middle" align="between" gap={8}>
      <Item title="服务端" span={2}>{data.server.name}@{data.server.version}</Item>
      <Item title="客户端" span={2}>{data.client.name}@{data.client.version}</Item>
      <Item title="主题" span={3}>{data.theme.name}@{data.theme.version}</Item>
    </Flex>
  </Card>
}

function Item(props: PropsWithChildren<{ title: string, span?: number }>) {
  return <Flex direction="vertical" span={props.span || 1} gap={[0, 8]}>
    <span style={{ color: '#666' }}>{props.title}</span>
    <Typography.Text ellipsis>{props.children}</Typography.Text>
  </Flex>
}