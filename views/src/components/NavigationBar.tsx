import React from 'react';

import styles from './NavigationBar.module.scss';
import { Icon } from '~/components/Icon';

export const NavigationBar: React.FC = () => {
  console.log('NavigationBar');
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Icon icon='menu' className={styles.menu_icon} />
        <h1>桃子记账🍑</h1>
      </div>
    </div>
  );
};
