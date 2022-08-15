import React from 'react';
import useSWRImmutable from 'swr/immutable';

import { getEmojis } from '~/service/emojis';
import { apiEmojis } from '~/service/api';

export default function useEmoji() {
  const { data: emojis } = useSWRImmutable(apiEmojis, getEmojis);

  const getEmoji = React.useCallback((name: 'peach' | 'rightFinger') => {
    if (emojis) {
      switch (name) {
        case 'peach': {
          return String.fromCodePoint(parseInt(emojis.data['Food & Drink'][11][0], 16));
        }

        case 'rightFinger': {
          return String.fromCodePoint(parseInt(emojis.data['People & Body'][19][0], 16));
        }

        default:
          return '';
      }
    }

    return '';
  }, [emojis]);

  return {
    emojis,
    getEmoji,
  };
}
