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
    <Divider type="vertical" />
    <span>最小：{_props.min || '无限'}</span>
    <span>最大：{_props.max || '无限'}</span>
  </Space>
}