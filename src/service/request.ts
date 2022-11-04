import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { useRequestHeader } from '@codixjs/codix';

const baseURL = '/api';

export const request = axios.create({
  baseURL: baseURL,
  withCredentials: true,
})

request.interceptors.response.use(transformResponseSuccess, transformResponseError);

function transformResponseSuccess(response: AxiosResponse) {
  if (response.data.status !== 200) {
    return Promise.reject({ 
      code: response.data.status, 
      message: response.data.error,
    })
  }
  response.data = response.data.data;
  return response;
}

function transformResponseError(error: any) {
  if (error?.status){
    error.code = error.status;
    return Promise.reject(error);
  }
  if (error.response) return Promise.reject({
    code: error.response.status,
    message: error.response.data,
  })
  return Promise.reject({
    code: 500,
    message: error.message,
  })
}

export function useBaseRequestConfigs(): AxiosRequestConfig {
  const host = useRequestHeader<string>('host');
  const cookie = useRequestHeader<string>('cookie');
  const referer = useRequestHeader<string>('referer');
  const protocol = getProtocol(referer);
  if (!host) return {};
  return {
    baseURL: protocol + host + baseURL,
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