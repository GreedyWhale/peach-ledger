import type { Response } from '~/types/request';

import request from '~/utils/request';

import { apiAuthCodes } from './api';

export const sendAuthCodes = (params: { email: string; scene?: 'signIn' }) => request.post<{}, Response<{}>>(apiAuthCodes, params, { showErrorDialog: false });
