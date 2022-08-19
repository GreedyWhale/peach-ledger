import type { GetEmojisResponse } from '~/service/emojis';

import React from 'react';

import styles from './EmojiSelector.module.scss';

import useEmoji, { showEmoji } from '~/hooks/useEmoji';

export interface EmojiSelectorProps {
  onSelect: (_emoji: string[]) => void;
}

export const EmojiSelector: React.FC<EmojiSelectorProps> = props => {
  const { emojis } = useEmoji();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const emojiCategories: (keyof GetEmojisResponse)[] = React.useMemo(() => {
    if (emojis) {
      return Object.keys(emojis.data) as unknown as (keyof GetEmojisResponse)[];
    }

    return [];
  }, [emojis]);

  const emojiList = React.useMemo(() => {
    if (emojis) {
      return emojis.data[emojiCategories[activeIndex]];
    }

    return [];
  }, [activeIndex, emojiCategories, emojis]);

  return (
    <div className={styles.container}>
      <ul className={styles.tabs}>
        {emojiCategories.map((value, index) => (
          <li
            key={value}
            data-active={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          >
            {value}
          </li>
        ))}
      </ul>

      <ul className={styles.emojis}>
        {emojiList.map(value => (
          <li
            key={value.join('-')}
            onClick={() => props.onSelect(value)}
          >
            {showEmoji(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};
