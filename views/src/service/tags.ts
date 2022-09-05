import type { Response } from '~/types/request';

import request from '~/utils/request';

import { apiTags } from './api';

export type AccountType = 'expenses' | 'income';

export type TagsResponse = {
  category: AccountType;
  deleted: boolean;
  emoji: string[];
  id: number;
  name: string;
}[];

export const getTags = (category: AccountType, signal?: AbortSignal) => request.get<TagsResponse, Response<TagsResponse>>(apiTags, { params: { category }, signal });
export const createTags = (params: {
  name: string;
  emoji: string[];
  user_id: number;
  category: AccountType;
}) => request.post(apiTags, params);
