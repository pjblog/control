import { request } from '../request';
import type { TPage, TPageState } from './types';
import type { AxiosRequestConfig } from 'axios';

export * from './types';

export async function getPage(id: number, configs?: AxiosRequestConfig) {
  const res = await request.get<TPageState>('/control/page/' + id, configs);
  return res.data;
}

export async function getPages(configs?: AxiosRequestConfig) {
  const res = await request.get<{ list: TPage[], total: number }>('/control/page', configs);
  return res.data;
}

export async function addNewPage(code: string, content: string) {
  const res = await request.post('/control/page', { code, content });
  return res.data;
}

export async function updatePage(id: number, code: string, content: string) {
  const res = await request.put('/control/page/' + id, { code, content })
  return res.data;
}

export async function deletePage(id: number) {
  const res = await request.delete('/control/page/' + id);
  return res.data;
}