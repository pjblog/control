import { Space, SpaceProps } from 'antd';
import React, { useMemo } from 'react';
import styles from './index.module.less';
import { TWidgetConfigProp } from './types';

import { Text } from './text';
import { Number } from './number';
import { Password } from './password';
import { CheckBox } from './checkbox';
import { CheckGroup } from './checkgroup';
import { TextArea } from './textarea';
import { RadioList } from './radio';
import { SelectList } from './select';
import { SwitchBox } from './switch';

type TKey<V> = TWidgetConfigProp<V>['type']
const types = {
  text: Text,
  number: Number,
  password: Password,
  checkbox: CheckBox,
  checkgroup: CheckGroup,
  textarea: TextArea,
  radio: RadioList,
  select: SelectList,
  switch: SwitchBox,
}

export function Some<V, T extends (TKey<V>)>(props: React.PropsWithoutRef<{
  type: T,
  name: string,
  label: string,
  value: V,
  options: TWidgetConfigProp<V>[T],
  onChange: (e: V) => void,
  size?: SpaceProps['size'],
  prefix?: React.ReactNode,
  suffix?: React.ReactNode,
}>) {
  // @ts-ignore
  const Comp = useMemo(() => types[props.type], [props.type]) as any;
  return <Space direction="vertical" size={props.size}>
    <Space className={styles.title} size={12}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.name}>{props.name}</div>
    </Space>
    {!!props.prefix && <div className={styles.prefix}>{props.prefix}</div>}
    <div className={styles.component}>
      <Comp value={props.value} options={props.options} onChange={props.onChange} />
    </div>
    {!!props.suffix && <div className={styles.suffix}>{props.suffix}</div>}
  </Space>
}