import { request } from '../request';
import { TUserInfo, TUserSearchProps } from './types';
import type { AxiosRequestConfig } from 'axios';

export * from './types';

export async function getAdminInfo(configs?: AxiosRequestConfig) {
  const res = await request.get<TUserInfo>('/me/admin', configs);
  return res.data;
}

export async function doLogin(account: string, password: string) {
  const res = await request.put('/login', { account, password });
  return res.data;
}

export async function getUsers(options: TUserSearchProps, configs?: AxiosRequestConfig) {
  const res = await request.get('/user', Object.assign(configs, {
    params: options,
  }))
  return res.data as {
    users: TUserInfo[],
    total: number,
  }
}

export async function setAdminStatus(account: string, status: boolean) {
  const res = await request.put(`/user/${account}/admin`, {
    admin: status,
  })
  return res.data;
}

export async function setForbidenStatus(account: string, status: boolean) {
  const res = await request.put(`/user/${account}/forbiden`, {
    forbiden: status,
  })
  return res.data;
}