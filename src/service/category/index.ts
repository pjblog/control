import { request } from '../request';
import type { BlogCategoryEntity, TUnOutableCategoryState } from './types';
import type { AxiosRequestConfig } from 'axios';

export * from './types';

export async function getCategories(configs?: AxiosRequestConfig) {
  const res = await request.get<BlogCategoryEntity[]>('/control/category', configs);
  return res.data;
}

export async function getUnOutableCategories(configs?: AxiosRequestConfig) {
  const res = await request.get<TUnOutableCategoryState[]>('/control/category/unoutable', configs);
  return res.data;
}

export async function addCategory(name: string, outable: boolean, outlink?: string) {
  const res = await request.post('/control/category', {
    cate_name: name,
    cate_outable: outable,
    cate_outlink: outlink,
  })
  return res.data;
}

export async function updateCategory(id: number, name: string, outlink?: string) {
  const configs: any = {
    cate_name: name,
    cate_outlink: outlink,
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