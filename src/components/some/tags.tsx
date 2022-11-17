import styles from './tag.module.less';
import { Space, Tag, Input, InputRef } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TWidgetConfigProp } from './types';
import { PlusOutlined, EnterOutlined } from '@ant-design/icons';

export function Tags(props: React.PropsWithoutRef<{
  value: string[],
  options: TWidgetConfigProp<string[]>['tags'],
  onChange: (v: string[]) => void,
}>) {
  const [value, setValue] = useState<string>(null);
  const [mode, setMode] = useState(false);
  const el = useRef<InputRef>(null);

  const submit = useCallback((tag: string) => {
    const _value = props.value || [];
    if (_value.includes(tag)) return;
    props.onChange([..._value, tag]);
    setMode(false);
    setValue(null);
  }, [props.value, props.onChange, setMode, setValue])

  const del = useCallback((val: string) => {
    const _value = props.value || [];
    if (_value.includes(val)) {
      const values = _value.slice();
      const index = values.indexOf(val);
      values.splice(index, 1);
      props.onChange([...values]);
    }
  }, [props.value, props.onChange]);

  useEffect(() => {
    if (mode && !!el.current) {
      el.current.focus();
    }
  }, [mode])

  return <Space direction={props.options?.direction}>
    {
      (props.value || []).map(val => {
        return <Tag key={val} closable onClose={() => del(val)}>{val}</Tag>
      })
    }
     {!!mode && <Input 
      className={styles.tagInput}
      value={value} 
      onChange={e => setValue(e.target.value)} 
      type="text" 
      size="small" 
      style={{ width: 120 }} 
      ref={el} 
      placeholder={props.options.placeholder}
      onPressEnter={e => submit(e.currentTarget.value)}
      onBlur={() => setMode(false)}
      suffix={<EnterOutlined />}
    />}
    {!mode && <Tag className={styles.newTag} onClick={() => setMode(true)}><PlusOutlined /> {props.options.text}</Tag>}
  </Space>
}