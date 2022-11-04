import { request } from '../request';
import { TLinkState, TLinkPostState } from './types';
import type { AxiosRequestConfig } from 'axios';

export * from './types';

export async function getLinks(configs?: AxiosRequestConfig) {
  const res = await request.get<TLinkState[]>('/control/link', configs);
  return res.data;
}

export async function addLink(options: TLinkPostState) {
  const res = await request.post('/control/link', options);
  return res.data;
}

export async function updateLink(id: number, options: TLinkPostState) {
  const res = await request.put('/control/link/' + id, options);
  return res.data;
}

export async function deleteLink(id: number) {
  const res = await request.delete('/control/link/' + id);
  return res.data;
}

export async function updateLinkStatus(id: number, status: boolean) {
  const res = await request.put('/control/link/' + id + '/status', { status });
  return res.data;
}