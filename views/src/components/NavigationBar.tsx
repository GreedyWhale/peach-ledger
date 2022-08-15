import React from 'react';

import styles from './NavigationBar.module.scss';
import { Icon } from '~/components/Icon';

import useEmoji from '~/hooks/useEmoji';

interface NavigationBarProps {
  onClickMenu: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = props => {
  const { getEmoji } = useEmoji();

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Icon icon='menu' className={styles.menu_icon} onClick={props.onClickMenu} />
        <h1>桃子记账 {getEmoji('Food & Drink', 11)}</h1>
      </div>
    </div>
  );
};
