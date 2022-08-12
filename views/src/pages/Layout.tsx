import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.scss';
import { NavigationBar } from '~/components/NavigationBar';
import { Sidebar } from '~/components/Sidebar';

export const Layout: React.FC = () => {
  const [visibleSidebar, setVisibleSidebar] = React.useState(false);

  return (
    <div className={styles.layout}>
      <NavigationBar onClickMenu={() => setVisibleSidebar(prev => !prev)}/>
      <Sidebar visible={visibleSidebar} onMaskClick={() => setVisibleSidebar(false)} />
      <Outlet />
    </div>
  );
};
