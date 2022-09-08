import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link, useNavigate } from 'react-router-dom';

import styles from './Sidebar.module.scss';
import { Icon } from '~/components/Icon';

import useEmoji from '~/hooks/useEmoji';
import { useUser } from '~/hooks/useUser';

interface SidebarProps {
  visible: boolean;
  onMaskClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = props => {
  const navigate = useNavigate();
  const { getEmoji } = useEmoji();
  const { user, signOut } = useUser();
  const CSSTransitionRef = React.useRef(null);
  const [maskAnimation, setMaskAnimation] = React.useState(false);

  return (
    <CSSTransition
      in={props.visible}
      timeout={200}
      classNames={{
        enter: styles.sidebar_animate_enter,
        enterActive: styles.sidebar_animate_enter_active,
        exit: styles.sidebar_animate_exit,
        exitActive: styles.sidebar_animate_exit_active,
      }}
      // @see https://github.com/reactjs/react-transition-group/releases/tag/v4.4.0
      nodeRef={CSSTransitionRef}
      onEntered={() => setMaskAnimation(true)}
      onExit={() => setMaskAnimation(false)}
      unmountOnExit
    >
      <div className={styles.container} ref={CSSTransitionRef}>
        <div className={styles.mask} data-animate={maskAnimation} onClick={props.onMaskClick}/>
        <main>
          <div className={styles.user_profile}>
            <h2>{user?.email || '未登录用户'}</h2>
            {user
              ? <p onClick={signOut}>{getEmoji('People & Body', 19)} 点击这里注销</p>
              : <p onClick={() => navigate('/signIn')}>{getEmoji('People & Body', 19)} 点击这里登录</p>
            }
          </div>
          <ul>
            <li><Link to='/item'><Icon icon='sidebarSummary'/> 数据总览</Link></li>
            <li><Link to='/item/chart'><Icon icon='sidebarChart'/> 统计图表</Link></li>
          </ul>
        </main>
      </div>
    </CSSTransition>
  );
};
