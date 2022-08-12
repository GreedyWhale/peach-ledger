import React from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './Sidebar.module.scss';
import { Icon } from '~/components/Icon';

interface SidebarProps {
  visible: boolean;
  onMaskClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = props => {
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
            <h2>未登录用户</h2>
            <p>👉 点击这里登录</p>
          </div>
          <ul>
            <li><Icon icon='sidebar_chart'/> 统计图表</li>
            <li><Icon icon='sidebar_export'/> 导出数据</li>
            <li><Icon icon='sidebar_notify'/> 记账提醒</li>
          </ul>
        </main>
      </div>
    </CSSTransition>
  );
};
