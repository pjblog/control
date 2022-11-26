import { request } from '../request';
import type { TBlogSettingProps, TConfigsGroup, TDiskState, TPluginDetailState } from './types';
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
  const res = await request.delete('/control/module/' + name);
  return res.data;
}

export async function checkUpdate(name: string) {
  const res = await request.get<boolean>('/control/check/update/' + name);
  return res.data;
}

export async function getVisitorStatistic(configs?: AxiosRequestConfig) {
  const res = await request.get<{ onlines: number, visitors: number }>('/control/statistic/visitors', configs);
  return res.data;
}

export async function getModuleDetail(name: string, configs?: AxiosRequestConfig) {
  const res = await request.get<TPluginDetailState>('/control/module/' + name, configs);
  return res.data;
}

export async function setModuleConfigs<T>(name: string, data: T) {
  const res = await request.put<number>('/control/module/' + name, data);
  return res.data;
}

export async function getVersions(configs?: AxiosRequestConfig) {
  type TVersion = {
    name: string,
    version: string,
  }
  const res = await request.get<Record<'server' | 'client' | 'theme', TVersion>>('/versions', configs)
  return res.data;
}

export async function getStatisticByDay(day: number = 7, configs?: AxiosRequestConfig) {
  const res = await request.get<{ date: string, total: number }[]>('/control/statistic/' + day, configs)
  return res.data;
}