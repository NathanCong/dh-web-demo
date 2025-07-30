import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://yunan.ink',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use((config) => config, (error) => {
  return Promise.reject(error);
});

/**
 * 响应拦截器
 */
instance.interceptors.response.use((response) => response.data, (error) => {
  return Promise.reject(error);
});

/**
 * GET 请求
 */
export function get(url, params) {
  return instance.get(url, { params });
}

/**
 * POST 请求
 */
export function post(url, data) {
  return instance.post(url, data);
}