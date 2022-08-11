import React from 'react';

import styles from './Button.module.scss';
import { Icon } from '~/components/Icon';

interface ButtonProps {
  className?: string;
  loading?: boolean;
  ghost?: boolean;
  disabled?: boolean;
  onClick?: () => Promise<any>;
}

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = props => {
  const [loading, setLoading] = React.useState(props.loading);

  const handleClick = async () => {
    if (loading || props.disabled) {
      return;
    }

    if (props.onClick) {
      setLoading(true);
      await props.onClick().catch(error => console.error(error));
      setLoading(false);
    }
  };

  return (
    <div
      className={[styles.container, props.className || ''].join(' ')}
      data-ghost={props.ghost}
      data-disabled={props.disabled}
    >
      <button className={styles.inner} onClick={handleClick}>
        {loading && <Icon icon='buttonLoading' className={styles.loadingIcon} />}
        {props.children}
      </button>
    </div>
  );
};
