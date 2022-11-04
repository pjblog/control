import { request } from '../request';
import type { TBlogSettingProps, TConfigsGroup } from './types';
import type { AxiosRequestConfig } from 'axios';
export * from './types';
export async function getConfigs(configs?: AxiosRequestConfig) {
  const res = await request.get<{
    value: TBlogSettingProps,
    state: TConfigsGroup[],
  }>('/control/configs', configs);
  return res.data;
}

export async function updateConfigs(data: TBlogSettingProps) {
  const res = await request.post('/control/configs', data);
  return res.data;
}