import React from 'react';
import styles from './index.module.less';
import { Divider, InputNumber, Space } from 'antd';
import { TWidgetConfigProp } from './types';

export function Number(props: React.PropsWithoutRef<{
  value: number,
  options: TWidgetConfigProp<number>['number'],
  onChange: (v: number) => void,
}>) {
  const { unit, ..._props } = props.options;
  return <Space>
    <InputNumber 
      {..._props} 
      value={props.value} 
      onChange={e => props.onChange(e)} 
    />
    <span className={styles.unit}>{unit || null}</span>
    {_props.min !== undefined || _props.max !== undefined && <Divider type="vertical" />}
    {_props.min !== undefined && <span>MIN:{_props.min}</span>}
    {_props.max !== undefined && <span>MAX:{_props.max}</span>}
  </Space>
}