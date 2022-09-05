import React from 'react';
import ReactDOM from 'react-dom/client';

import styles from './Dialog.module.scss';
import { Icon } from '~/components/Icon';

interface DialogProps {
  content: React.ReactNode;
  buttons?: string[];
  icon?: React.ReactNode;
  onDestroyed?: (_index: number) => void;
}

export const Dialog: React.FC<DialogProps> = props => (
  <div className={styles.container}>
    <div className={styles.mask} onClick={() => props.onDestroyed?.(-1)}/>
    <main>
      <div className={styles.icon_wrap}>
        {props.icon || <Icon icon='tip' className={styles.tip_icon} />}
      </div>
      <div className={styles.content}>{props.content}</div>
      <div className={styles.buttons}>
        {props.buttons?.map((button, index) => (
          <button key={button} onClick={() => props.onDestroyed?.(index)}>{button}</button>
        ))}
      </div>
    </main>
  </div>
);

export const showDialog = (params: DialogProps) => {
  const { onDestroyed, buttons, ...rest } = params;
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  const _onDestroyed = (index: number) => {
    if (onDestroyed) {
      onDestroyed(index);
    }

    root.unmount();
    div.remove();
  };

  root.render(<Dialog
    buttons={buttons || ['确定']}
    onDestroyed={_onDestroyed}
    {...rest}
  />);
};
