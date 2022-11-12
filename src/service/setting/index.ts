import { request } from '../request';
import type { TBlogSettingProps, TConfigsGroup, TDiskState } from './types';
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

export async function getDiskInfo(configs?: AxiosRequestConfig) {
  const res = await request.get<TDiskState[]>('/control/disk/info', configs);
  return res.data;
}

export async function getTheme(configs?: AxiosRequestConfig) {
  const res = await request.get<string>('/control/theme');
  return res.data;
}

export async function setTheme(theme: string) {
  const res = await request.put('/control/theme', { theme });
  return res.data;
}

export async function uninstall(name: string) {
  const res = await request.delete('/control/theme/' + name);
  return res.data;
}

export async function checkUpdate(name: string) {
  const res = await request.get<boolean>('/control/check/update/' + name);
  return res.data;
}

export async function getModuleStatistic(configs?: AxiosRequestConfig) {
  const res = await request.get<{ themes: number, plugins: number }>('/control/statistic/modules', configs);
  return res.data;
}