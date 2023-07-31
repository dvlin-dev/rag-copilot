import axios from 'axios';
import { ToastError } from '@/utils/common';
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

http.interceptors.request.use(
  (config) => {
    const bearerToken = localStorage.getItem('bearerToken') || '';
    if (bearerToken.length !== 0) {
      config.headers['authorization'] = 'Bearer ' + bearerToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      const errorData = error.response.data;
      const { status } = errorData;
      let {
        message: { message },
      } = errorData;
      message = Array.isArray(message) ? message[0] : message;
      switch (status) {
        case 400:
          ToastError(`${message}`);
          console.error(`错误请求: ${message}`);
          break;
        case 401:
          Handle401(message);
          break;
        case 403:
          ToastError(message);
          break;
        case 404:
          ToastError(message);
          break;
        case 500:
          ToastError(`网络发生波动，请联系管理员`);
          break;
        default:
          if (status >= 500) {
            ToastError(`网络错误，请稍后重试`);
          } else {
            ToastError(message || '请求失败');
          }
      }
    } else {
      ToastError(error.message);
      console.error(`Request configuration error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

const Handle401 = (message: string) => {
  const { pathname } = window.location;
  if (!pathname.includes('login') && pathname !== '/') {
    ToastError(message);
    window.location.href = '/login';
  }
};

export default http;

export const fetcher = (url: string) => http.get(url).then((res) => res.data);
