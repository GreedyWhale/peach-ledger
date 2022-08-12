import React from 'react';

import styles from './NavigationBar.module.scss';
import { Icon } from '~/components/Icon';

interface NavigationBarProps {
  onClickMenu: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = props => (
  <div className={styles.container}>
    <div className={styles.inner}>
      <Icon icon='menu' className={styles.menu_icon} onClick={props.onClickMenu} />
      <h1>桃子记账🍑</h1>
    </div>
  </div>
);
