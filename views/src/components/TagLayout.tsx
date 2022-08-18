import React from 'react';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import styles from './TagLayout.module.scss';
import { EmojiSelector } from '~/components/EmojiSelector';
import { Button } from '~/components/Button';

import { showEmoji } from '~/hooks/useEmoji';
import { Rules, validator } from '~/utils/validator';

type Errors = Partial<Record<'name' | 'sign', string[]>>;

interface Store {
  sign: string[];
  name: string;
  errors: Errors;

  setSign: (_sign: string[]) => void;
  setName: (_name: string) => void;
  updateErrors: (_errors: Errors) => void;
}

interface TagLayoutProps {
  pageType: 'create' | 'edit'
}

const formRules: Rules<Pick<Store, 'name' | 'sign'>> = [
  { key: 'name', message: '标签名是必要的', required: true },
  { key: 'name', message: '标签名格式错误', required: name => /^.{2,4}$/gm.test(name as string) },
  { key: 'sign', message: '符号是必要的', required: sign => Boolean((sign as string[]).length) },
];

const useStore = create<Store>()(
  devtools(
    immer(set => ({
      sign: [],
      name: '',
      errors: {},

      setSign: sign => set(state => {
        state.sign = sign;
      }),

      setName: name => set(state => {
        // 为了修复移动端 input 在输入后全部删除导致 基线对齐错位问题
        // @see https://stackoverflow.com/a/20847688
        if (!name) {
          state.name = ' ';
          return;
        }

        state.name = name;
      }),

      updateErrors: errors => set(state => {
        Object.assign(state.errors, errors);
      }),
    })),
  ),
);

export const TagLayout: React.FC<React.PropsWithChildren<TagLayoutProps>> = props => {
  const { sign, name, errors } = useStore(state => ({
    sign: state.sign,
    name: state.name,
    errors: state.errors,
  }));
  const { setSign, setName, updateErrors } = useStore.getState();

  const handleCreate = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const errors = validator({ sign, name: name.trim() }, formRules);

    if (errors) {
      updateErrors(errors);
      return;
    }

    // TODO 创建 删除 更新逻辑
    console.log('go on');
  };

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.form_item}>
          <label>
            标签名：
            <input
              type='text'
              placeholder='2-4个字符'
              maxLength={4}
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </label>
          <p className={styles.error_message}>{errors.name?.[0]}</p>
        </div>
        <div className={styles.form_item}>
          <label>
            符号：{sign && <span>{showEmoji(sign)}</span>}
          </label>
          <p className={styles.error_message}>{errors.sign?.[0]}</p>
        </div>
        <EmojiSelector onSelect={setSign} />
        <p className={styles.tip}>记账时长按标签，即可进行编辑</p>
        {props.pageType === 'create' && <Button onClick={handleCreate}>创建</Button>}
        {props.pageType === 'edit' && (
          <div className={styles.buttons}>
            <Button onClick={handleCreate} className={styles.margin_right_20}>保存</Button>
            <Button onClick={handleCreate} ghost>删除</Button>
          </div>
        )}
      </form>
    </div>
  );
};
