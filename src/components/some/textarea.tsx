import React from 'react';
import { Input } from 'antd';
import { TWidgetConfigProp } from './types';

export function TextArea(props: React.PropsWithoutRef<{
  value: string,
  options: TWidgetConfigProp<string>['textarea'],
  onChange: (v: string) => void,
}>) {
  return <Input.TextArea 
    {...props.options} 
    value={props.value} 
    onChange={e => props.onChange(e.target.value)} 
  />
}