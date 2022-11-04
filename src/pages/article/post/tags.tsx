import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Input, InputRef, Tag } from 'antd';
import { PlusOutlined, EnterOutlined } from '@ant-design/icons';
import { Flex } from '../../../components';
export function Tags(props: React.PropsWithoutRef<{
  value: string[],
  setValue: (vals: string[]) => void,
}>) {
  const [value, setValue] = useState<string>(null);
  const [mode, setMode] = useState(false);
  const el = useRef<InputRef>(null);
  const submit = useCallback((tag: string) => {
    if (props.value.includes(tag)) return;
    props.setValue([...props.value, tag]);
    setMode(false);
    setValue(null);
  }, [props.value, props.setValue])
  const del = useCallback((val: string) => {
    if (props.value.includes(val)) {
      const values = props.value.slice();
      const index = values.indexOf(val);
      values.splice(index, 1);
      props.setValue([...values]);
    }
  }, [props.value, props.setValue]);
  useEffect(() => {
    if (mode && !!el.current) {
      el.current.focus();
    }
  }, [mode])
  return <Flex valign="middle">
    <span style={{ marginRight: 12 }}>文章标签</span>
    {props.value.map(val => <Tag key={val} closable onClose={() => del(val)}>{val}</Tag>)}
    {!!mode && <Input 
      className={styles.tagInput}
      value={value} 
      onChange={e => setValue(e.target.value)} 
      type="text" 
      size="small" 
      style={{ width: 120 }} 
      ref={el} 
      placeholder="输入新的标签" 
      onPressEnter={e => submit(e.currentTarget.value)}
      onBlur={() => setMode(false)}
      suffix={<EnterOutlined />}
    />}
    {!mode && <Tag className={styles.newTag} onClick={() => setMode(true)}><PlusOutlined /> 新标签</Tag>}
  </Flex>
}