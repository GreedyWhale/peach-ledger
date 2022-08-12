import React from 'react';

import styles from './Icon.module.scss';

export interface IconProps {
  icon: 'add'
  | 'chart'
  | 'dashboard'
  | 'global'
  | 'logo'
  | 'money'
  | 'menu'
  | 'arrowLeft'
  | 'buttonLoading'
  | 'sidebar_chart'
  | 'sidebar_export'
  | 'sidebar_notify';
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = props => (
  <svg
    className={[styles.icon, props.className || ''].join(' ')}
    onClick={props.onClick}
  >
    <use xlinkHref={`#${props.icon}`}></use>
  </svg>
);
