import { request } from '../request';
import type { TArticle, TArticleProps, TArticlePostData } from './types';
import type { AxiosRequestConfig } from 'axios';

export * from './types';

export async function getArticles(options: {
  category?: number,
  keyword?: string,
  page: number,
  size: number
} = {
  page: 1,
  size: 10,
}, configs?: AxiosRequestConfig) {
  const res = await request.get<{ list: TArticle[], total: number }>(
    '/control/article', 
    Object.assign(configs, {
      params: options,
    })
  );
  return res.data;
}

export async function deleteArticle(id: number) {
  const res = await request.delete('/control/article/' + id);
  return res.data;
}

export async function getArticle(id: number, configs?: AxiosRequestConfig) {
  const res = await request.get<TArticleProps>('/control/article/' + id, configs);
  return res.data;
}

export async function addNewArticle(data: TArticlePostData) {
  const res = await request.post('/control/article', data);
  return res.data;
}

export async function updateArticleById(id: number, data: TArticlePostData) {
  const res = await request.put('/control/article/' + id, data);
  return res.data;
}

export async function getPreview(content: string) {
  const res = await request.post('/control/article/preview', { text: content });
  return res.data;
}

export async function setCommenable(id: number, status: boolean) {
  const res = await request.put('/control/article/' + id + '/commentable', {
    status
  })
  return res.data;
}