import { request } from '../request';
import type { BlogCategoryEntity, TStorageCategory } from './types';
import type { AxiosRequestConfig } from 'axios';

export * from './types';

export async function getCategories(configs?: AxiosRequestConfig) {
  const res = await request.get<BlogCategoryEntity[]>('/control/category', configs);
  return res.data;
}

export async function getCategoriesByShort(configs?: AxiosRequestConfig) {
  const res = await request.get<TStorageCategory[]>('/category', configs);
  return res.data;
}

export async function updateCategory(id: number, name: string, order?: number) {
  const configs: any = {
    cate_name: name,
  }
  if (order !== undefined) {
    configs.cate_order = order;
  }
  const res = await request.put('/control/category/' + id, configs);
  return res.data;
}

export async function updateCategoryOrder(ids: number[]) {
  const res = await request.put('/control/category/order', ids);
  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await request.delete('/control/category/' + id);
  return res.data;
}