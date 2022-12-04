import axios from 'axios';
import { interceptRequestSuccess } from './success';
import { interceptRequestError } from './error';
import { BASE_URL } from './config';

export const request = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

request.interceptors.response.use(interceptRequestSuccess, interceptRequestError);