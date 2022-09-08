import type { Response } from '~/types/request';
import type { AccountType } from './tags';

import request from '~/utils/request';

import { apiItems } from './api';

type CreateItemResponse = {
  amount: number;
  category: AccountType
  created_at: string;
  id: number;
  name: string;
  note: string;
  tag_id: number;
  updated_at: number
  user_id: number;
  date: string;
}

type ItemsListResponse = {
  items: (CreateItemResponse & {
    tags: {
      name: string;
      emoji: string[];
    }
  })[];
  balance: {
    total_income: number;
    total_expenses: number;
  };
  pagination: {
    current_page: number;
    first_page: boolean;
    last_page: boolean;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
  };
}

export const createItem = (params: {
  tag_id: number;
  name: string;
  amount: number;
  category: AccountType;
  date: string;
  note?: string;
}) => request.post<CreateItemResponse, Response<CreateItemResponse>>(apiItems, params, { showErrorDialog: false });

export const getItems = (params: {
  page: number;
  start_date: string;
  end_date: string;
  /** ASC: 小 -> 大， DESC: 大 -> 小 */
  sort?: 'ASC' | 'DESC';
}, signal?: AbortSignal) => request.get<ItemsListResponse, Response<ItemsListResponse>>(apiItems, { params, signal });

export const deleteItem = (id: number) => request.delete(`${apiItems}/${id}`);
