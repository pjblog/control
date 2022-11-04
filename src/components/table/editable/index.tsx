import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Space, Typography, Table, Button } from 'antd';
import { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { EditableCell } from './cell';
import { PlusOutlined } from '@ant-design/icons';
import { TGetColumns } from './types';

export * from './types';
export * from './cell';

export function EditableTable<T extends object = {}>(props: React.PropsWithoutRef<TableProps<T> & {
  dataSource: T[],
  rowKey: keyof T,
  getColumns: TGetColumns<T>,
  post: (r: T) => void,
  addNew: () => T,
  addText?: string,
}>) {
  const [form] = Form.useForm();
  const [data, setData] = useState(props.dataSource);
  const [editingKey, setEditingKey] = useState(null);
  const isEditing = useCallback((record: T) => record[props.rowKey] === editingKey, [props.rowKey, editingKey]);
  const cancel = useCallback(() => setEditingKey(null), [setEditingKey]);
  const edit = useCallback((record: Partial<T>) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record[props.rowKey]);
  }, [form, setEditingKey, props.rowKey]);
  const save = useCallback(async (key: any) => {
    const _row = (await form.validateFields()) as T;
    const newData = [...data];
    const index = newData.findIndex(item => key === item[props.rowKey]);
    const item = newData[index];
    const row = {
      ...item,
      ..._row,
    }
    props.post(row);
    newData.splice(index, 1, row);
    setData(newData);
    setEditingKey(null);
  }, [form, data, props.rowKey, setData, setEditingKey]);

  const remove = useCallback((id: any) => {
    const _data = [...data];
    const index = _data.findIndex(x => x[props.rowKey] === id);
    if (index > -1) {
      _data.splice(index, 1);
      setData(_data);
    }
  }, [data, setData]);

  const Actions = useCallback((options: React.PropsWithChildren<{ record: T }>) => {
    const editable = isEditing(options.record);
    return editable ? (
      <Space>
        <Typography.Link onClick={() => save(options.record[props.rowKey])}>保存</Typography.Link>
        <Typography.Link onClick={cancel}>取消</Typography.Link>
      </Space>
    ) : (
      <Space>
        <Typography.Link disabled={!!editingKey} onClick={() => edit(options.record)}>编辑</Typography.Link>
        {options.children}
      </Space>
    );
  }, [isEditing, props.rowKey, cancel, editingKey, edit]);

  const columns = useMemo(() => props.getColumns(Actions, remove), [props.getColumns, Actions, remove]);
  const mergedColumns = useMemo(() => {
    return columns.map((col: ColumnType<T>) => {
      // @ts-ignore
      if (!col.editable) return col;
      return {
        ...col,
        onCell: (record: T) => ({
          record,
          // @ts-ignore
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }) as ColumnsType<T>;
  }, [isEditing, columns])

  const footer = useCallback(() => {
    const onClick = () => setData([...data, props.addNew()]);
    return <Button icon={<PlusOutlined />} type="primary" onClick={onClick}>{props.addText || '新增'}</Button>
  }, [setData, props.addText])

  useEffect(() => {
    setData(props.dataSource);
  }, [props.dataSource])

  return <Form form={form} component={false}>
    <Table
      {...props}
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      dataSource={data}
      columns={mergedColumns}
      footer={footer}
    />
  </Form>
}