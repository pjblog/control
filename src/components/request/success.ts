import type { AxiosResponse } from 'axios';

export function interceptRequestSuccess(response: AxiosResponse) {
  if (response.data.status !== 200) {
    return Promise.reject({ 
      code: response.data.status, 
      message: response.data.error,
    })
  }
  response.data = response.data.data;
  return response;
}