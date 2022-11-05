import React from 'react';
import { EditableCellProps } from './types';
import { Form } from 'antd';
export function EditableCell<T>(props: React.PropsWithChildren<EditableCellProps<T>>) {
  const {
    editing,
    editable,
    dataIndex,
    title,
    edittype,
    record,
    index,
    children,
    ...restProps
  } = props;
  return <td {...restProps}>
    {
      editing && editable 
        ? <Form.Item name={dataIndex} style={{ margin: 0 }}>
            {edittype}
          </Form.Item> 
        : children
    }
  </td>
}