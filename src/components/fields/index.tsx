import { Col, Row, RowProps, SpaceProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { TWidgetConfigProp } from '../some/types';
import { Some } from '../some';

export function Fields<T>(props: React.PropsWithChildren<{
  dataSource: T,
  schemas: TWidgetConfigProp<T[keyof T]>[],
  gutter?: RowProps['gutter'],
  size?: SpaceProps['size'],
  onChange: (e: T) => void,
  className?: string
}>) {
  const [data, setData] = useState(props.dataSource);
  const getValue = useCallback((name: keyof T) => data[name], [data]);
  const setValue = useCallback(<U extends keyof T>(name: U, val: T[U]) => setData({ 
    ...data,
    [name]: val,
  }), [data]);

  useEffect(() => setData(props.dataSource), [props.dataSource]);
  useEffect(() => props.onChange(data), [data]);

  return <Row gutter={props.gutter}>
    {
      props.schemas.map(schema => {
        return <Field 
          {...schema} 
          getValue={getValue} 
          setValue={setValue} 
          size={props.size} 
          key={schema.name} 
          className={props.className}
        />
      })
    }
    <Col span={24}>{props.children}</Col>
  </Row>
}

function Field<T>(schema: React.PropsWithoutRef<TWidgetConfigProp<T[keyof T]> & {
  getValue: (name: keyof T) => T[keyof T],
  setValue: <U extends keyof T>(name: U, val: T[U]) => void,
  size?: SpaceProps['size'],
  className?: string,
}>) {
  const schemaValue = schema.getValue(schema.name as keyof T);
  return <Col span={24} key={schema.name}>
    <Some 
      type={schema.type} 
      value={schemaValue} 
      label={schema.label} 
      name={schema.name} 
      options={schema[schema.type]} 
      onChange={e => schema.setValue(schema.name as keyof T, e)} 
      prefix={schema.prefix} 
      suffix={schema.suffix}
      size={schema.size}
      className={schema.className}
    />
  </Col>
}