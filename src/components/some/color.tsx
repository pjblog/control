import React from 'react';
import styles from './color.module.less';
import { TWidgetConfigProp } from './types';
import { SketchPicker } from 'react-color';
import { Dropdown, Space } from 'antd';

export function Color(props: React.PropsWithoutRef<{
  value: string,
  options: TWidgetConfigProp<number>['color'],
  onChange: (v: string) => void,
}>) {
  return <Dropdown trigger={['click']} dropdownRender={() => <SketchPicker color={props.value} onChangeComplete={e => props.onChange(e.hex)} width="250px" />}>
    <Space size={16}>
      <div className={styles.box}>
        <div className={styles.color} style={{ backgroundColor: props.value }}></div>
      </div>
      <span className={styles.value}>{props?.value?.toUpperCase()}</span>
    </Space>
  </Dropdown>
}