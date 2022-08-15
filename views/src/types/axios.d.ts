// eslint-disable-next-line no-unused-vars
import type { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: number;
    retryDelay?: number;
    __retry?: number;
    showErrorDialog?: boolean;
  }
}
