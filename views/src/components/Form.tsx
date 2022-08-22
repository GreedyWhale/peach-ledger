import React from 'react';

import styles from './Form.module.scss';
import { EmojiSelector, EmojiSelectorProps } from '~/components/EmojiSelector';
import { DatePicker, DatePickerProps } from '~/components/DatePicker';
import { Button } from '~/components/Button';

import { setClassNames } from '~/utils/classNames';

interface FormProps {
  onSubmit?: React.FormEventHandler;
  className?: string;
}

type FormItemProps = {
  error?: string;
  label: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
} & (
  {
    type: 'text';
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    maxLength?: number;
  } |
  { type: 'emoji'; onSelect: EmojiSelectorProps['onSelect'] } |
  { type: 'date'; value: string; onDate: DatePickerProps['onFinish'] } |
  { type: 'shortCode'; value: string; onSendCode: () => Promise<void>; onChange: React.ChangeEventHandler<HTMLInputElement>; } |
  { type: undefined }
);

export const Form: React.FC<React.PropsWithChildren<FormProps>> = props => (
  <form className={[styles.form, props.className || ''].join(' ')} onSubmit={props.onSubmit}>
    {props.children}
  </form>
);

export const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = props => {
  const [dataPickerVisible, setDataPickerVisible] = React.useState(false);
  const [shortCodeButton, setShortCodeButton] = React.useState('发送验证码');
  const codeTimer = React.useRef(-1);

  const handleSendCode = async () => {
    if (codeTimer.current !== -1 || props.type !== 'shortCode') {
      return;
    }

    const resetCodeTimer = () => {
      window.clearInterval(codeTimer.current);
      codeTimer.current = -1;
    };

    let countdown = 60;
    codeTimer.current = window.setInterval(() => {
      if (countdown <= 0) {
        setShortCodeButton('重新发送');
        resetCodeTimer();
        return;
      }

      countdown -= 1;
      setShortCodeButton(`${countdown}s 后可重新获取`);
    }, 1000);
    await props.onSendCode().catch(resetCodeTimer);
  };

  if (!props.type) {
    return <>{props.children}</>;
  }

  return (
    <div className={styles.form_item_wrap} data-disabled={props.disabled}>
      {props.type === 'text' && (
        <div className={setClassNames([styles.form_item, props.className])}>
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
          <div className={setClassNames([styles.form_item, styles.emoji_item, props.className])}>
            <label>{props.label}</label>
            <p className={styles.error_message}>{props.error}</p>
          </div>
          <EmojiSelector onSelect={props.onSelect} />
        </>
      )}
      {props.type === 'date' && (
        <div className={setClassNames([styles.form_item, props.className])}>
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
      {props.type === 'shortCode' && (
        <div className={setClassNames([styles.form_item, props.className, styles.code_item])}>
          <label>
            {props.label}
            <input
              type='text'
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
            />
            <Button onClick={handleSendCode} className={styles.send_code_button} text>{shortCodeButton}</Button>
          </label>
          <p className={styles.error_message}>{props.error}</p>
        </div>
      )}
    </div>
  );
};
