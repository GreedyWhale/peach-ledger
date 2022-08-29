import React from 'react';
import { useImmer } from 'use-immer';

import styles from './SignIn.module.scss';
import { Form, FormItem } from '~/components/Form';
import { Button } from '~/components/Button';
import { Icon } from '~/components/Icon';

import { validator, Rules } from '~/utils/validator';
import { sendAuthCodes } from '~/service/user';
import { promiseWithAllSettled } from '~/utils/promise';

export const SignIn: React.FC = () => {
  const [formData, setFormData] = useImmer({
    email: '',
    code: '',
  });

  const [errors, setErrors] = useImmer({
    email: [],
    code: [],
  });

  const handleSubmit = async () => {
    const rules: Rules<typeof formData> = [
      { key: 'email', required: true, message: '必填' },
      { key: 'email', required: email => /.+@.+/gm.test(email), message: '邮箱格式错误' },
      { key: 'code', required: true, message: '必填' },
    ];
    const errors = validator(formData, rules);

    if (errors) {
      setErrors(draft => { Object.assign(draft, errors); });
      return;
    }

    console.log('done');
  };

  const handleSendCode = async () => {
    const rules: Rules<typeof formData> = [
      { key: 'email', required: true, message: '必填' },
      { key: 'email', required: email => /.+@.+/gm.test(email), message: '邮箱格式错误' },
    ];
    const errors = validator(formData, rules);

    if (errors) {
      setErrors(draft => { Object.assign(draft, errors); });
      return Promise.reject();
    }

    const result = await promiseWithAllSettled(sendAuthCodes({ email: formData.email }));

    if (result.status === 'rejected') {
      const _errors = result.reason.errors;
      if (_errors) {
        const { email = [], code = [], ...rest } = _errors;
        if (rest) {
          Object.values(rest).forEach(value => code.push(...value));
        }

        setErrors(draft => { Object.assign(draft, { email, code }); });
        return Promise.reject();
      }

      setErrors(draft => { Object.assign(draft, { code: result.reason.message }); });
      return Promise.reject();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo_info}>
        <Icon icon='logo' className={styles.logo} />
        <h1>桃子记账</h1>
      </div>

      <Form>
        <FormItem
          label='邮箱地址：'
          type='text'
          value={formData.email}
          placeholder='请输入邮箱地址'
          error={errors.email[0]}
          onChange={event => {
            setErrors(draft => { draft.email = []; });
            setFormData(draft => { draft.email = event.target.value; });
          }}
        />

        <FormItem
          label='验证码：'
          type='shortCode'
          value={formData.code}
          placeholder='六位数字'
          error={errors.code[0]}
          onChange={event => {
            setErrors(draft => { draft.code = []; });
            setFormData(draft => { draft.code = event.target.value; });
          }}
          onSendCode={handleSendCode}
        />

        <Button className={styles.submit_button} onClick={handleSubmit}>登录</Button>
      </Form>
    </div>
  );
};
