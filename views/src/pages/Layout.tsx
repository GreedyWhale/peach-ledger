import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.scss';
import { NavigationBar } from '~/components/NavigationBar';
import { Sidebar } from '~/components/Sidebar';

export const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);

  return (
    <div className={styles.layout}>
      <NavigationBar onClickMenu={() => setSidebarVisible(prev => !prev)}/>
      <Sidebar visible={sidebarVisible} onMaskClick={() => setSidebarVisible(false)} />
      <Outlet />
    </div>
  );
};
