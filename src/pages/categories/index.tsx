import { useAsyncCallback, useClient } from "@codixjs/fetch";
import { useGetAsync } from "@pjblog/control-hooks";
import { EditableTable, TGetColumns, request } from '@pjblog/control-hooks';
import { message, Input, Select, Popconfirm, Typography } from "antd";
import { useCallback } from "react";
import { BlogCategoryEntity, createNewBlogCategoryEntity } from "./types";
import { MenuOutlined } from '@ant-design/icons';

export default function Page() {
  const { data, loading, execute } = useGetAsync({ 
    id: 'categories',
    url: '/-/category' 
  });
  const ADD = useAsyncCallback(addCategory);
  const UPDATE = useAsyncCallback(updateCategory);
  const DELETE = useAsyncCallback(deleteCategory);
  const ORDER = useAsyncCallback(updateCategoryOrder);

  const del = (id: number, remove: Function) => {
    if (!id) return remove(0);
    DELETE.execute(id)
      .then(execute)
      .then(() => message.success('删除成功'))
      .catch(e => message.error(e.message));
  }

  const onSort = (ids: number[]) => {
    ORDER.execute(ids)
      .catch(e => message.error(e.message));
  }

  const getColumns: TGetColumns<BlogCategoryEntity> = useCallback((Actions, Remove) => {
    return [
      {
        title: '#',
        width: 50,
        align: 'center',
        render: (s: BlogCategoryEntity) => s.id === 0
          ? undefined
          : <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
      },
      {
        title: '分类名',
        dataIndex: 'cate_name',
        editable: () => true,
        width: 300,
        edittype: () => <Input placeholder="请输入分类名" />,
      },
      {
        title: '外链？',
        align: 'center',
        width: 100,
        dataIndex: 'cate_outable',
        editable: (r: BlogCategoryEntity) => r.id === 0,
        edittype: () => <Select options={[
          { label: '是', value: true },
          { label: '否', value: false }
        ]} />,
        render(outable: boolean) {
          return outable ? '是' : '否';
        }
      },
      {
        title: '外链地址',
        dataIndex: 'cate_outlink',
        editable: () => true,
        edittype: (r: BlogCategoryEntity) => {
          return <Input placeholder="请输入外链地址" disabled={r.id > 0 && !r.cate_outable} />
        },
      },
      {
        title: '操作',
        width: 150,
        align: 'right',
        dataIndex: 'id',
        render: (_: number, s: BlogCategoryEntity) => {
          return <Actions record={s}>
            <Popconfirm
                title={<div>
                  确定删除?<br />删除后其下的文章将自动被转移到回收站。<br />您可以通过回收站重新设置分类。
                </div>}
                onConfirm={() => del(s.id, Remove)}
                okText="确定"
                cancelText="取消"
                placement="left"
              >
                <Typography.Link>删除</Typography.Link>
              </Popconfirm>
          </Actions>
        },
      }
    ]
  }, []);

  const client = useClient();
  const post = useCallback((r: BlogCategoryEntity) => {
    const promise = !r.id
      ? ADD.execute(r.cate_name, r.cate_outable, r.cate_outlink)
      : UPDATE.execute(r.id, r.cate_name, r.cate_outlink)
    promise
      .then(() => client.reload('categories:unoutable'))
      .then(execute)
      .then(() => message.success(!r.id ? '新增成功' : '更新成功'))
      .catch(e => message.error(e.message))
  }, [execute])

  return <div className="container">
    <EditableTable<BlogCategoryEntity>
      rowKey="id" 
      dataSource={data}
      addText="添加分类"
      getColumns={getColumns}
      addNew={createNewBlogCategoryEntity}
      loading={loading} 
      pagination={false}
      post={post}
      addable={r => r.id === 0}
      onSort={onSort}
      sortable
      size="middle"
    />
  </div>
}

async function addCategory(name: string, outable: boolean, outlink?: string) {
  const res = await request.put('/-/category', {
    cate_name: name,
    cate_outable: outable,
    cate_outlink: outlink,
  })
  return res.data;
}

async function updateCategory(id: number, name: string, outlink?: string) {
  const configs: any = {
    cate_name: name,
    cate_outlink: outlink,
  }
  const res = await request.post('/-/category/' + id, configs);
  return res.data;
}

async function deleteCategory(id: number) {
  const res = await request.delete('/-/category/' + id);
  return res.data;
}

async function updateCategoryOrder(ids: number[]) {
  const res = await request.post('/-/category/order', ids);
  return res.data;
}