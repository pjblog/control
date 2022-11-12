import { request } from '../request';
import type { AxiosRequestConfig } from 'axios';
import { TCommentState } from './types';
import { TArticleEntity } from '../article';

export * from './types';

export async function getControlCommentsByArticle(aid: number = 0, page: number, size: number, configs?: AxiosRequestConfig) {
  const res = await request.get<{ list: TCommentState[], total: number, article: TArticleEntity }>(
    '/control/comment/' + aid, 
    Object.assign(configs, {
      params: {
        page, size,
      },
    })
  );
  return res.data;
}

export async function deleteComment(cid: number) {
  const res = await request.delete('/comment/' + cid);
  return res.data;
}

export async function getCommentStatistic(configs?: AxiosRequestConfig) {
  const res = await request.get<{ total: number, replies: number }>('/control/statistic/comment', configs);
  return res.data;
}