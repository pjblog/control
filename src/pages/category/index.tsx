import React, { useMemo, useState } from 'react';
import styles from './index.module.less';
import { getCategories, BlogCategoryEntity, createNewBlogCategoryEntity, updateCategory, updateCategoryOrder, deleteCategory, useBaseRequestConfigs } from '../../service';
import { useAsync, useAsyncCallback } from '@codixjs/fetch';
import { Button, Table, Typography, Input, Form, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { ColumnsType } from 'antd/lib/table';
import { arrayMoveImmutable } from 'array-move';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: BlogCategoryEntity;
  index: number;
  children: React.ReactNode;
}

export default function CategoryPage() {
  const configs = useBaseRequestConfigs();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(0);
  const isEditing = (record: BlogCategoryEntity) => record.id === editingKey;
  const { data, loading, setData } = useAsync('categories', () => getCategories(configs));
  const isAdding = useMemo(() => data.findIndex(d => d.id === 0) > -1, [data]);

  const modify = useAsyncCallback(updateCategory);
  const Order = useAsyncCallback(updateCategoryOrder);
  const Deletion = useAsyncCallback(deleteCategory);

  const footer = () => {
    const onClick = () => setData([...data, createNewBlogCategoryEntity()]);
    return <Button icon={<PlusOutlined />} type="primary" onClick={onClick} disabled={isAdding}>添加新分类</Button>
  }
  const cancel = (id: number) => {
    if (id > 0) return setEditingKey(0);
    setData(data.slice(0, -1));
  };
  const edit = (record: Partial<BlogCategoryEntity>) => {
    form.setFieldsValue({...createNewBlogCategoryEntity(), ...record});
    setEditingKey(record.id);
  };

  const del = (id: number) => {
    if (!id) return;
    Deletion.execute(id)
      .then(() => {
        const newData = data.slice();
        const index = newData.findIndex(d => d.id === id);
        newData.splice(index, 1);
        setData(newData);
        return message.success('删除成功');
      })
      .catch(e => message.error(e.message));
  }

  const save = async (key: number) => {
    try {
      const row = (await form.validateFields()) as BlogCategoryEntity;
      const newData = [...data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item = newData[index];
        const res = await modify.execute(item.id, row.cate_name, item.id === 0 ? item.cate_order : undefined);
        newData.splice(index, 1, res);
        setData(newData);
        setEditingKey(0);
        await message.success('操作成功');
      }
    } catch (errInfo) {
      await message.warn(errInfo.message);
    }
  };

  const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props} />
  ));
  const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ));

  const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

  const columns: ColumnsType<BlogCategoryEntity> = [
    {
      title: '#',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: (a,b) => !!b.id && <DragHandle />,
    },
    // {
    //   title: '排序',
    //   dataIndex: 'cate_order',
    //   width: 80,
    //   align: 'center',
    //   className: styles.order,
    // },
    {
      title: '分类名',
      dataIndex: 'cate_name',
      // @ts-ignore
      editable: true,
    },
    {
      title: '操作',
      width: 150,
      align: 'right',
      render: (record: BlogCategoryEntity) => {
        const editable = isEditing(record);
        return editable 
          ? <Space>
              <Typography.Link onClick={() => save(record.id)}>保存</Typography.Link>
              <Typography.Link onClick={() => cancel(record.id)}>取消</Typography.Link>
            </Space>
          : <Space>
              <Typography.Link onClick={() => edit(record)}>编辑</Typography.Link>
              <Popconfirm
                title="确定删除?"
                onConfirm={() => del(record.id)}
                okText="确定"
                cancelText="取消"
                placement="left"
              >
                <Typography.Link>删除</Typography.Link>
              </Popconfirm>
            </Space>
      },
    }
  ]

  const mergedColumns = columns.map(col => {
    // @ts-ignore
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record: BlogCategoryEntity) => ({
        record,
        inputType:'text',
        // @ts-ignore
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  }) as ColumnsType<BlogCategoryEntity>;

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(data.slice(), oldIndex, newIndex).filter(
        (el: any) => !!el,
      );
      const _data = newData.map((d, i) => {
        d.cate_order = i + 1;
        return d;
      })
      setData(_data);
      Order.execute(_data.map(d => d.id)).catch(e => message.error(e.message));
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = data.findIndex(x => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return <Form form={form} component={false}>
    <Table pagination={false} className={styles.table} rowKey="id" loading={loading} columns={mergedColumns} dataSource={data} footer={footer} components={{
        body: {
          cell: EditableCell,
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }} />
  </Form>
}

function EditableCell(props: React.PropsWithChildren<EditableCellProps>) {
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
  return <td {...restProps}>
    {
      editing 
        ? <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入${title}!`,
              },
              {
                max: 50,
                message: '最大支持50个字符'
              }
            ]}
          ><Input placeholder="请输入分类名" bordered={false} autoFocus size="small" allowClear /></Form.Item>
        : children
    }
  </td>
}