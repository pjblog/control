import MD5 from 'crypto-js/md5';
import { useAsync, Client } from '@codixjs/fetch';
import { DependencyList, useMemo } from 'react';
import { useRequestConfigs } from './config';
import { request } from './request';

const HttpReuestCodes = new Map<string, string>();

export function reloadHttpRequest(client: Client, ...ids: string[]) {
  const codes = ids.map(id => {
    if (HttpReuestCodes.has(id)) {
      return HttpReuestCodes.get(id);
    }
  }).filter(Boolean);
  if (codes.length) {
    client.reload(...codes);
  }
}

function createHttpRequestCode(id: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string) {
  const md5 = MD5(method + ':' + url).toString();
  HttpReuestCodes.set(id, md5);
  return md5;
}

export function useGetAsync<T = any>(
  options: {
    id: string,
    url: string, 
    querys?: object, 
    headers?: object, 
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => createHttpRequestCode(options.id, 'GET', options.url), [options.id, options.url]);
  return useAsync(code, async () => {
    const res = await request.get<T>(options.url, Object.assign({}, configs, {
      params: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, deps);
}

export function usePostAsync<T = any>(
  options: {
    id: string,
    url: string,
    querys?: object, 
    headers?: object, 
    data?: object
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => createHttpRequestCode(options.id, 'POST', options.url), [options.id, options.url]);
  return useAsync(code, async () => {
    const res = await request.post<T>(options.url, options.data, Object.assign({}, configs, {
      params: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, deps);
}

export function usePutAsync<T = any>(
  options: {
    id: string,
    url: string,
    querys?: object, 
    headers?: object, 
    data?: object
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => createHttpRequestCode(options.id, 'PUT', options.url), [options.id, options.url]);
  return useAsync(code, async () => {
    const res = await request.put<T>(options.url, options.data, Object.assign({}, configs, {
      params: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, deps);
}

export function useDelAsync<T = any>(
  options: {
    id: string,
    url: string, 
    querys?: object, 
    headers?: object, 
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => createHttpRequestCode(options.id, 'DELETE', options.url), [options.id, options.url]);
  return useAsync(code, async () => {
    const res = await request.delete<T>(options.url, Object.assign({}, configs, {
      params: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, deps);
}
