import React from 'react';
import { Checkbox } from 'antd';
import { TWidgetConfigProp } from './types';

export function CheckGroup<T extends string | number | boolean>(props: React.PropsWithoutRef<{
  value: T[],
  options: TWidgetConfigProp<T[]>['checkgroup'],
  onChange: (v: T[]) => void,
}>) {
  return <Checkbox.Group
    {...props.options}
    value={props.value}
    onChange={props.onChange}
  />
}