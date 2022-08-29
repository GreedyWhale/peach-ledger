import React from 'react';

import styles from './Button.module.scss';
import { Icon } from '~/components/Icon';

type OnClickEventType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface ButtonProps {
  className?: string;
  loading?: boolean;
  ghost?: boolean;
  text?: boolean;
  disabled?: boolean;
  onClick?: (_event: OnClickEventType) => Promise<any>;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = props => {
  const [loading, setLoading] = React.useState(props.loading);

  const handleClick = async (event: OnClickEventType) => {
    if (loading || props.disabled) {
      return;
    }

    if (props.onClick) {
      setLoading(true);
      await props.onClick(event).catch(error => console.error(error));
      setLoading(false);
    }
  };

  return (
    <div
      className={[styles.container, props.className || ''].join(' ')}
      data-ghost={props.ghost}
      data-text={props.text}
      data-disabled={props.disabled}
    >
      <button className={styles.inner} onClick={handleClick} type={props.type || 'button'}>
        <span data-visible={loading} className={styles.icon_wrap}>
          <Icon icon='buttonLoading' className={styles.loading_icon} />
        </span>
        {props.children}
      </button>
    </div>
  );
};
