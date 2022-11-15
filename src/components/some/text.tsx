import React from 'react';
import { Input } from 'antd';
import { TWidgetConfigProp } from './types';

export function Text(props: React.PropsWithoutRef<{
  value: string,
  options: TWidgetConfigProp<string>['text'],
  onChange: (v: string) => void,
}>) {
  return <Input 
    {...props.options} 
    type="text" 
    value={props.value} 
    onChange={e => props.onChange(e.target.value)} 
  />
}