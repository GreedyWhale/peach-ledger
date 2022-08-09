import React from 'react';

import styles from './icon.module.scss';

export interface IconProps {
  icon: 'add' | 'button_loading' | 'chart' | 'dashboard' | 'global' | 'logo' | 'money';
  className?: string;
}

export const Icon: React.FC<IconProps> = props => {
  console.log(1);

  return (
    <svg className={[styles.icon, props.className || ''].join(' ')}>
      <use xlinkHref={`#${props.icon}`}></use>
    </svg>
  );
};
