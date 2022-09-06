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
export const getTag = (id: number, signal?: AbortSignal) => request.get<TagsResponse[number], Response<TagsResponse[number]>>(`${apiTags}/${id}`, { signal });
export const createTag = (params: {
  name: string;
  emoji: string[];
  user_id: number;
  category: AccountType;
}) => request.post(apiTags, params);
export const updateTag = (
  id: number,
  params: Partial<{ deleted: boolean; name: string; emoji: string[] }>,
) => request.patch(`${apiTags}/${id}`, params);
export const deleteTag = (id: number) => request.delete(`${apiTags}/${id}`);
