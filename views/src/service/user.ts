import type { Response } from '~/types/request';

import request from '~/utils/request';

import { apiAuthCodes, apiSessions, apiUsers } from './api';

type UserResponse = {
  email: string;
  id: number;
}

export const sendAuthCodes = (params: { email: string; scene?: 'signIn' }) => request.post<{}, Response<{}>>(apiAuthCodes, params, { showErrorDialog: false });

export const getSession = (params: { email: string; code: string; }) => request.post<{ token: string; }, Response<{ token: string; }>>(apiSessions, params);

export const getUser = () => request.get<UserResponse, Response<UserResponse>>(apiUsers);
