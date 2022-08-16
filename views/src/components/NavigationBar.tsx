import React from 'react';

import styles from './NavigationBar.module.scss';

interface NavigationBarProps {
  title: string;
  icon: React.ReactNode;
}

export const NavigationBar: React.FC<NavigationBarProps> = props => (
  <div className={styles.container}>
    <div className={styles.inner}>
      {props.icon}
      <h1>{props.title}</h1>
    </div>
  </div>
);
