import React from 'react';

import styles from './layout.module.scss';

export const Layout: React.FC<React.PropsWithChildren> = props => {
  console.log(1);

  return (
    <div className={styles.layout}>
      {props.children}
    </div>
  );
};
