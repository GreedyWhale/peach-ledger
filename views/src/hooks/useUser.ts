import useSWR from 'swr';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { getSession, getUser } from '~/service/user';
import { apiUsers } from '~/service/api';
import { LOCAL_TOKEN } from '~/utils/constants';
import { showDialog } from '~/components/Dialog';

export const useUser = () => {
  const navigate = useNavigate();
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

  const showSignInDialog = React.useCallback(() => {
    if (!data?.data.id) {
      showDialog({
        content: '请先登录',
        buttons: ['取消', '登录'],
        onDestroyed(index) {
          if (index) {
            navigate('/signIn');
          }
        },
      });

      return true;
    }

    return false;
  }, [data?.data.id, navigate]);

  return {
    user: data ? data.data : data,
    error,
    refreshUser: mutate,
    signOut,
    showSignInDialog,
  };
};

export const signIn = async (params: { email: string; code: string;}) => {
  const token = await getSession(params);
  window.localStorage.setItem(LOCAL_TOKEN, token.data.token);
};
