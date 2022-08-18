import React from 'react';
import useSWRImmutable from 'swr/immutable';

import { getEmojis, GetEmojisResponse } from '~/service/emojis';
import { apiEmojis } from '~/service/api';

export const showEmoji = (emojiArray: string[]) => emojiArray.reduce((prev, current) => prev + String.fromCodePoint(parseInt(current, 16)), '');

export default function useEmoji() {
  const { data: emojis } = useSWRImmutable(apiEmojis, getEmojis);
  const getEmoji = React.useCallback((key: keyof GetEmojisResponse, index: number) => {
    if (emojis) {
      return showEmoji(emojis.data[key][index]);
    }

    return '';
  }, [emojis]);

  return {
    emojis,
    getEmoji,
  };
}
