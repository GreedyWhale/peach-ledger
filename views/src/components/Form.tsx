import React from 'react';

import styles from './Form.module.scss';
import { EmojiSelector, EmojiSelectorProps } from '~/components/EmojiSelector';
import { DatePicker, DatePickerProps } from '~/components/DatePicker';

interface FormProps {
  onSubmit?: React.FormEventHandler;
  className?: string;
}

type FormItemProps = { error?: string; label: React.ReactNode; disabled?: boolean; } & (
  {
    type: 'text';
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    maxLength?: number;
    placeholder?: string;
  } |
  { type: 'emoji'; onSelect: EmojiSelectorProps['onSelect'] } |
  { type: 'date'; value: string; onDate: DatePickerProps['onFinish'] } |
  { type: undefined }
);

export const Form: React.FC<React.PropsWithChildren<FormProps>> = props => (
  <form className={[styles.form, props.className || ''].join(' ')} onSubmit={props.onSubmit}>
    {props.children}
  </form>
);

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = props => {
  const [dataPickerVisible, setDataPickerVisible] = React.useState(false);

  if (!props.type) {
    return <>{props.children}</>;
  }

  return (
    <div className={styles.form_item_wrap} data-disabled={props.disabled}>
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
      {props.type === 'date' && (
        <div className={styles.form_item}>
          <label>
            {props.label}
            <input type='text' value={props.value} readOnly onClick={() => setDataPickerVisible(true)}/>
          </label>
          <p className={styles.error_message}>{props.error}</p>
          {dataPickerVisible && <DatePicker onFinish={date => {
            props.onDate(date);
            setDataPickerVisible(false);
          }}/>}
        </div>
      )}
    </div>
  );
};
