import React from 'react';
import { Radio, Space } from 'antd';
import { TWidgetConfigProp } from './types';

export function RadioList<T extends string | number | boolean>(props: React.PropsWithoutRef<{
  value: T,
  options: TWidgetConfigProp<T>['radio'],
  onChange: (v: T) => void,
}>) {
  const { direction, size, options, ..._props } = props.options;
  return <Radio.Group {..._props} onChange={e => props.onChange(e.target.value)} value={props.value}>
    <Space direction={direction} size={size}>
      {
        options.map(option => {
          const _option = (typeof option !== 'object' ? { label: option + '', value: option } : option) as { label: string, value: T }
          return <Radio value={_option.value} key={_option.label}>{_option.label}</Radio>
        })
      }
    </Space>
  </Radio.Group>  
}