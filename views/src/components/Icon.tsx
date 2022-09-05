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
  | 'sidebarChart'
  | 'sidebarExport'
  | 'sidebarNotify'
  | 'sidebarSummary'
  | 'date'
  | 'triangle'
  | 'addSquare'
  | 'danger'
  | 'tip';
  className?: string;
  onClick?: () => void;
  color?: string;
}

export const Icon: React.FC<IconProps> = props => (
  <svg
    className={[styles.icon, props.className || ''].join(' ')}
    onClick={props.onClick}
    style={{
      color: props.color,
    }}
  >
    <use xlinkHref={`#${props.icon}`}></use>
  </svg>
);
