import React from 'react';
import { EditableCellProps } from './types';
import { InputNumber, Input, Form } from 'antd';
export function EditableCell<T>(props: React.PropsWithChildren<EditableCellProps<T>>) {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  } = props;
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return <td {...restProps}>
    {editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            message: `Please Input ${title}!`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    ) : (
      children
    )}
  </td>
}