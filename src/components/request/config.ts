import { useRequestHeader } from '@codixjs/codix';
import type { AxiosRequestConfig } from 'axios';

export const BASE_URL = '/-';
export function useRequestConfigs(): AxiosRequestConfig {
  const host = useRequestHeader<string>('host');
  const cookie = useRequestHeader<string>('cookie');
  const referer = useRequestHeader<string>('referer');
  const protocol = getProtocol(referer);
  if (!host) return {};
  return {
    baseURL: protocol + host + BASE_URL,
    headers: {
      cookie
    }
  }
}

function getProtocol(referer: string) {
  if (!referer) return 'http://';
  const index = referer.indexOf('//');
  if (index === -1) return 'http://';
  return referer.substring(0, index + 2);
}