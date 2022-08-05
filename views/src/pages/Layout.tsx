import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './layout.module.scss';

export const Layout: React.FC = () => {
  console.log(1);

  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
};
