import React from 'react';

import styles from './Icon.module.scss';

export interface IconProps {
  icon: 'add' | 'chart' | 'dashboard' | 'global' | 'logo' | 'money' | 'menu' | 'arrowLeft';
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
