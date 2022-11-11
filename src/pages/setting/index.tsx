import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import styles from './index.module.less';
import { Col, Row, Typography, Input, InputNumber, Switch, Space, Button, message, Checkbox, Divider } from 'antd';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { getConfigs, TComponents, TConfigsGroup, TBlogSettingProps, TInput, TTextarea, TInputNumber, TSwitch, TCheckbox, updateConfigs, useBaseRequestConfigs } from '../../service';
import { Flex } from '../../components';
interface TGetAndSet {
  getValue: (name: string) => any,
  setValue: (name: string, val: any) => void,
}
export default function SettingPage() {
  const configs = useBaseRequestConfigs();
  const { data: { value, state }, setData } = useAsync('configs', () => getConfigs(configs));
  const getValue = useCallback((name: string) => value[name], [value]);
    const setValue = useCallback((name: string, val: any) => {
      setData({ 
        state, 
        value: {
          ...value,
          [name]: val,
        }
      })
    }, [setData, state, value]);
  return <Row gutter={[0, 24]}>
    {
      state.map(group => {
        return <Col span={24} key={group.name}>
          <Group {...group} getValue={getValue} setValue={setValue} />
        </Col>
      })
    }
    <Col span={24}>
      <Save value={value} />
    </Col>
  </Row>
}

function getComponent(type: keyof TComponents) {
  switch (type) {
    case 'input': return InputComponent;
    case 'textarea': return TextareaComponent;
    case 'number': return NumberComponent;
    case 'switch': return SwitchComponent;
    case 'checkbox': return CheckBoxComponent;
  }
}

function Group(props: React.PropsWithoutRef<TConfigsGroup & TGetAndSet>) {
  return <div className={styles.group}>
    <Typography.Title level={4}>
      {props.title}
      <span className={styles.subtitle}>{props.subTitle}</span>
    </Typography.Title>
    <div className={styles.groupOptions}>
      {
        props.options.map(channel => {
          const Com = getComponent(channel.component);
          return <Channel 
            title={channel.title} 
            key={channel.name} 
            className={styles.channel} 
            prefix={channel.prevfixText}
            suffix={channel.suffixText}
            subTitle={channel.name}
          >
            {/*@ts-ignore*/}
            {!!Com && <Com {...channel.options} name={channel.name} getValue={props.getValue} setValue={props.setValue} />}
          </Channel>
        })
      }
    </div>
  </div>
}

function Save(props: React.PropsWithoutRef<{ value: TBlogSettingProps }>) {
  const { loading, execute } = useAsyncCallback(() => updateConfigs(props.value))
  const submit = () => {
    execute()
      .then(() => message.success('保存成功'))
      .catch(e => message.error(e.message));
  }
  return <Button type="primary" loading={loading} onClick={submit}>保存</Button>
}

function Channel(props: React.PropsWithChildren<{ 
  className?: string,
  title: React.ReactNode, 
  prefix?: React.ReactNode,
  suffix?: React.ReactNode,
  subTitle?: string,
}>) {
  return <Flex block direction="vertical" align="left" gap={[0, 8]} className={props.className}>
    <Space className={styles.channel_title}>{props.title}<Typography.Text copyable={{ text: props.subTitle }}>{props.subTitle}</Typography.Text></Space>
    {!!props.prefix && <div className={styles.channel_description}>{props.prefix}</div>}
    <div className={styles.channel_body}>{props.children}</div>
    {!!props.suffix && <div className={styles.channel_description}>{props.suffix}</div>}
  </Flex>
}

function InputComponent(props: React.PropsWithoutRef<TInput & TGetAndSet & { name: string }>) {
  const _value = useMemo(() => props.getValue(props.name), [props.getValue, props.name]);
  const [value, setValue] = useState<string>(_value);
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => props.setValue(props.name, value))
  }, [value]);
  return <Input
    type={props.type}
    style={props.style}
    maxLength={props.maxLength}
    showCount={props.showCount}
    allowClear={props.allowClear}
    value={value}
    onChange={e => setValue(e.target.value)}
    placeholder={props.placeholder}
  />
}

function TextareaComponent(props: React.PropsWithoutRef<TTextarea & TGetAndSet & { name: string }>) {
  const _value = useMemo(() => props.getValue(props.name), [props.getValue, props.name]);
  const [value, setValue] = useState<string>(_value);
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => props.setValue(props.name, value))
  }, [value]);
  return <Input.TextArea
    style={props.style}
    maxLength={props.maxLength}
    showCount={props.showCount}
    allowClear={props.allowClear}
    value={value}
    onChange={e => setValue(e.target.value)}
    autoSize={props.autoSize}
    placeholder={props.placeholder}
  />
}

function NumberComponent(props: React.PropsWithoutRef<TInputNumber & TGetAndSet & { name: string }>) {
  const _value = useMemo(() => props.getValue(props.name), [props.getValue, props.name]);
  const [value, setValue] = useState<number>(_value);
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => props.setValue(props.name, value))
  }, [value]);
  return <Space>
    <InputNumber
      style={props.style}
      value={value}
      onChange={e => setValue(e)}
      max={props.max}
      min={props.min}
      step={props.step}
    />
    <span>{props.unit}</span>
    <Divider type="vertical" />
    {!!props.max ? <span className={styles.gray}>最大：{props.max}</span> : null}
    {!!props.min ? <span className={styles.gray}>最小：{props.min}</span> : null}
  </Space>
}

function SwitchComponent(props: React.PropsWithoutRef<TSwitch & TGetAndSet & { name: string }>) {
  const __value = useMemo(() => props.getValue(props.name), [props.getValue, props.name]);
  const _value = props.reverse ? !__value : __value;
  const [value, setValue] = useState<boolean>(_value);
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => props.setValue(props.name, props.reverse ? !value : value))
  }, [value]);
  return <Switch
    checked={value}
    onChange={e => setValue(e)}
    checkedChildren={props.checkedChildren}
    unCheckedChildren={props.unCheckedChildren}
  />
}

function CheckBoxComponent(props: React.PropsWithoutRef<TCheckbox & TGetAndSet & { name: string }>) {
  const __value = useMemo(() => props.getValue(props.name), [props.getValue, props.name]);
  const _value = props.reverse ? !__value : __value;
  const [value, setValue] = useState<boolean>(_value);
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => props.setValue(props.name, props.reverse ? !value : value))
  }, [value]);
  return <Checkbox checked={value} onChange={e => setValue(e.target.checked)}>
    {value ? props.checkedText : props.uncheckedText}
  </Checkbox>
}