import React from 'react';
import { Flex } from './flex';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export function Loading(props: React.PropsWithoutRef<{ size?: number }>) {
  return <Flex block full align="center" valign="middle">
    <Spin indicator={<LoadingOutlined style={{ fontSize: props.size || 14 }} spin />} />
  </Flex>;
}