import { useAsync } from '@codixjs/fetch';
import { DependencyList, useMemo } from 'react';
import { useRequestConfigs } from './config';
import { encodeSign } from './encode';
import { request } from './request';

export function useGetAsync<T = any>(
  options: {
    id?: string,
    url: string, 
    querys?: object, 
    headers?: object, 
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => {
    return options.id || encodeSign(options.url, options.querys || {}, options.headers || {});
  }, [options.id, options.url, options.querys, options.headers]);
  return useAsync(code, async () => {
    const res = await request.get<T>(options.url, Object.assign({}, configs, {
      param: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, [code, ...(deps || [])]);
}

export function usePostAsync<T = any>(
  options: {
    id?: string,
    url: string,
    querys?: object, 
    headers?: object, 
    data?: object
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => {
    return options.id || encodeSign(options.url, options.querys || {}, options.headers || {}, options.data || {})
  }, [options.id, options.url, options.querys, options.headers, options.data]);
  return useAsync(code, async () => {
    const res = await request.post<T>(options.url, options.data, Object.assign({}, configs, {
      param: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, [code, ...(deps || [])]);
}

export function usePutAsync<T = any>(
  options: {
    id?: string,
    url: string,
    querys?: object, 
    headers?: object, 
    data?: object
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => {
    return options.id || encodeSign(options.url, options.querys || {}, options.headers || {}, options.data || {})
  }, [options.id, options.url, options.querys, options.headers, options.data]);
  return useAsync(code, async () => {
    const res = await request.put<T>(options.url, options.data, Object.assign({}, configs, {
      param: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, [code, ...(deps || [])]);
}

export function useDelAsync<T = any>(
  options: {
    id?: string,
    url: string, 
    querys?: object, 
    headers?: object, 
  },
  deps?: DependencyList,
) {
  const configs = useRequestConfigs();
  const code = useMemo(() => {
    return options.id || encodeSign(options.url, options.querys || {}, options.headers || {});
  }, [options.id, options.url, options.querys, options.headers]);
  return useAsync(code, async () => {
    const res = await request.delete<T>(options.url, Object.assign({}, configs, {
      param: options.querys,
      headers: options.headers,
    }))
    return res.data;
  }, [code, ...(deps || [])]);
}
