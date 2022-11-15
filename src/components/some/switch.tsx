import React from 'react';
import { Switch } from 'antd';
import { TWidgetConfigProp } from './types';

export function SwitchBox(props: React.PropsWithoutRef<{
  value: boolean,
  options: TWidgetConfigProp<boolean>['switch'],
  onChange: (v: boolean) => void,
}>) {
  return <Switch {...props.options} checked={props.value} onChange={e => props.onChange(e)} />
}