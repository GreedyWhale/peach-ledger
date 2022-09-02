import useSWR from 'swr';
import React from 'react';

import { getSession, getUser } from '~/service/user';
import { apiUsers } from '~/service/api';
import { LOCAL_TOKEN } from '~/utils/constants';

export const useUser = () => {
  const { data, error, mutate } = useSWR(apiUsers, () => {
    if (!window.localStorage.getItem(LOCAL_TOKEN)) {
      return null;
    }

    return getUser().catch(() => window.localStorage.removeItem(LOCAL_TOKEN));
  });

  const signOut = React.useCallback(() => {
    window.localStorage.removeItem(LOCAL_TOKEN);
    mutate();
  }, [mutate]);

  return {
    user: data ? data.data : data,
    error,
    refreshUser: mutate,
    signOut,
  };
};

export const signIn = async (params: { email: string; code: string;}) => {
  const token = await getSession(params);
  window.localStorage.setItem(LOCAL_TOKEN, token.data.token);
};
