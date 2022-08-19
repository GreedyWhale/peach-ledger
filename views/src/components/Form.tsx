import React from 'react';

import styles from './Form.module.scss';
import { EmojiSelector, EmojiSelectorProps } from '~/components/EmojiSelector';

interface FormProps {
  onSubmit?: React.FormEventHandler;
}

type FormItemProps = { error?: string; label: React.ReactNode; } & (
  {
    type: 'text';
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    maxLength?: number;
    placeholder?: string;
  } |
  { type: 'emoji'; onSelect: EmojiSelectorProps['onSelect'] } |
  { type: undefined }
);

export const Form: React.FC<React.PropsWithChildren<FormProps>> = props => (
  <form className={styles.form} onSubmit={props.onSubmit}>
    {props.children}
  </form>
);

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = props => {
  if (!props.type) {
    return <>{props.children}</>;
  }

  return (
    <>
      {props.type === 'text' && (
        <div className={styles.form_item}>
          <label>
            {props.label}
            <input
              type='text'
              placeholder={props.placeholder}
              maxLength={props.maxLength}
              value={props.value}
              onChange={props.onChange}
            />
          </label>
          <p className={styles.error_message}>{props.error}</p>
        </div>
      )}
      {props.type === 'emoji' && (
        <>
          <div className={styles.form_item}>
            <label>{props.label}</label>
            <p className={styles.error_message}>{props.error}</p>
          </div>
          <EmojiSelector onSelect={props.onSelect} />
        </>
      )}
    </>
  );
};
