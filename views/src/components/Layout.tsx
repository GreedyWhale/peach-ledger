import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import styles from './Layout.module.scss';
import { NavigationBar } from '~/components/NavigationBar';
import { Sidebar } from '~/components/Sidebar';
import { Icon } from '~/components/Icon';

import useEmoji from '~/hooks/useEmoji';

export const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const { getEmoji } = useEmoji();
  const location = useLocation();
  const navigate = useNavigate();

  const navigateConfig = React.useMemo(() => {
    const defaultTitle = `桃子记账 ${getEmoji('Food & Drink', 11)}`;
    const titleMap: Record<string, string> = {
      '/item': '记一笔',
      '/tag/create': '创建标签',
    };

    return {
      isHome: location.pathname === '/home',
      title: titleMap[location.pathname] || defaultTitle,
    };
  }, [getEmoji, location.pathname]);

  const handleClickMenu = () => {
    if (navigateConfig.isHome) {
      setSidebarVisible(prev => !prev);
      return;
    }

    navigate(-1);
  };

  return (
    <div className={styles.layout}>
      <NavigationBar
        title={navigateConfig.title}
        icon={
          <Icon
            icon={navigateConfig.isHome ? 'menu' : 'arrowLeft'}
            className={styles.menu_icon}
            onClick={handleClickMenu}
          />
        }
      />
      <Sidebar visible={sidebarVisible} onMaskClick={() => setSidebarVisible(false)} />
      <Outlet />
    </div>
  );
};
