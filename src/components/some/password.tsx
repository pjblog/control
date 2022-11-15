import React from 'react';
import { Input } from 'antd';
import { TWidgetConfigProp } from './types';

export function Password(props: React.PropsWithoutRef<{
  value: string,
  options: TWidgetConfigProp<string>['password'],
  onChange: (v: string) => void,
}>) {
  return <Input 
    {...props.options} 
    type="password" 
    value={props.value} 
    onChange={e => props.onChange(e.target.value)} 
  />
}