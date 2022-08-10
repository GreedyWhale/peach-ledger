import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.scss';
import { NavigationBar } from '~/components/NavigationBar';

export const Layout: React.FC = () => {
  console.log(1);

  return (
    <div className={styles.layout}>
      <NavigationBar />
      <Outlet />
    </div>
  );
};
