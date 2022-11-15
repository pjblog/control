import React from 'react';
import { Checkbox } from 'antd';
import { TWidgetConfigProp } from './types';

export function CheckBox(props: React.PropsWithoutRef<{
  value: boolean,
  options: TWidgetConfigProp<boolean>['checkbox'],
  onChange: (v: boolean) => void,
}>) {
  const { unCheckedChildren, checkedChildren, ..._props } = props.options
  return <Checkbox {..._props} checked={props.value} onChange={e => props.onChange(e.target.checked)}>{
    !!props.value
      ? checkedChildren
      : unCheckedChildren
  }</Checkbox>
}