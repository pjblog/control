import React from 'react';
import { Select } from 'antd';
import { TWidgetConfigProp } from './types';

export function SelectList<T extends string | number | boolean>(props: React.PropsWithoutRef<{
  value: T,
  options: TWidgetConfigProp<T>['select'],
  onChange: (v: T) => void,
}>) {
  return <Select
    {...props.options}
    value={props.value}
    onChange={props.onChange}
  />
}