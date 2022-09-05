import type { Response } from '~/types/request';

import axios, { AxiosError } from 'axios';

import { REQUEST_CODE_NO_RESPONSE, REQUEST_CODE_CODE_ERROR, LOCAL_TOKEN } from '~/utils/constants';
import { showDialog } from '~/components/Dialog';
import { Icon } from '~/components/Icon';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 30000,
  showErrorDialog: true,
});

let dialogLock = false;

axiosInstance.interceptors.request.use(config => {
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${window.localStorage.getItem(LOCAL_TOKEN)}`;
  return config;
});

axiosInstance.interceptors.response.use(response => ({
  ...response.data,
  code: response.status,
}), (error: AxiosError<Response<unknown>>) => {
  let result: Response<unknown> = {
    data: null,
    code: 0,
    message: '',
  };

  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  if (error.config.retry) {
    error.config.__retry = error.config.__retry || 0;

    if (error.config.__retry < error.config.retry) {
      error.config.__retry += 1;

      const backOff = new Promise(resolve => {
        window.setTimeout(() => resolve(true), error.config.retryDelay || 1000);
      });

      return backOff.then(() => axiosInstance(error.config));
    }
  }

  if (error.response) { // 服务器响应码不在2xx范围
    result = {
      ...error.response.data,
      message: error.response.data.message || error.response.statusText,
      code: error.response.status,
    };
  } else if (error.request) { // 请求已发出，但没有回应
    result = {
      message: error.message || '请求失败',
      code: REQUEST_CODE_NO_RESPONSE,
      data: null,
    };
  } else { // 代码出错
    result = {
      message: error.message || '请求出错',
      code: REQUEST_CODE_CODE_ERROR,
      data: null,
    };
  }

  if (error.config.showErrorDialog && !dialogLock) {
    dialogLock = true;
    showDialog({
      icon: <Icon icon='danger' color='#FF4C29' />,
      content: result.message,
      onDestroyed() {
        dialogLock = false;
      },
    });
  }

  return Promise.reject(result);
});

export default axiosInstance;
