import React, { FormEvent } from 'react';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import styles from './TagLayout.module.scss';
import { Form, FormItem } from '~/components/Form';
import { Button } from '~/components/Button';

import { showEmoji } from '~/hooks/useEmoji';
import { Rules, validator } from '~/utils/validator';

type Errors = Partial<Record<'name' | 'sign', string[]>>;

interface InitialStoreStore {
  sign: string[];
  name: string;
  errors: Errors;
}
interface Store extends InitialStoreStore{
  setSign: (_sign: string[]) => void;
  setName: (_name: string) => void;
  updateErrors: (_errors: Errors) => void;
  resetStore: () => void;
}

interface TagLayoutProps {
  pageType: 'create' | 'edit'
}

const formRules: Rules<Pick<Store, 'name' | 'sign'>> = [
  { key: 'name', message: '标签名是必要的', required: true },
  { key: 'name', message: '标签名格式错误', required: name => /^.{2,4}$/gm.test(name as string) },
  { key: 'sign', message: '符号是必要的', required: sign => Boolean((sign as string[]).length) },
];

const initialStore: InitialStoreStore = {
  sign: [],
  name: '',
  errors: {},
};

const useStore = create<Store>()(
  devtools(
    subscribeWithSelector(
      immer(set => ({
        ...initialStore,

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

        resetStore: () => set(initialStore),
      })),
    ),
  ),
);

export const TagLayout: React.FC<React.PropsWithChildren<TagLayoutProps>> = props => {
  const { sign, name, errors } = useStore(state => ({
    sign: state.sign,
    name: state.name,
    errors: state.errors,
  }));
  const { setSign, setName, updateErrors, resetStore } = useStore.getState();
  const unsubscribeName = useStore.subscribe(
    state => state.name,
    () => updateErrors({ name: [] }),
  );
  const unsubscribeSign = useStore.subscribe(
    state => state.sign,
    () => updateErrors({ sign: [] }),
  );

  const handleCreateTag = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validator({ sign, name: name.trim() }, formRules);

    if (errors) {
      updateErrors(errors);
      return;
    }

    // TODO 创建 删除 更新逻辑
    console.log('go on');
  };

  React.useEffect(() => unsubscribeName, [unsubscribeName]);
  React.useEffect(() => unsubscribeSign, [unsubscribeSign]);
  React.useEffect(() => resetStore, [resetStore]);

  return (
    <div className={styles.container}>
      <Form>
        <FormItem
          type='text'
          label='标签名：'
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder='2-4个字符'
          maxLength={4}
          error={errors.name?.[0]}
        />

        <FormItem
          type='emoji'
          error={errors.sign?.[0]}
          label={<>符号：{sign && <span>{showEmoji(sign)}</span>}</>}
          onSelect={setSign}
        />

        <p className={styles.tip}>记账时长按标签，即可进行编辑</p>
        {props.pageType === 'create' && <Button onClick={handleCreateTag}>创建</Button>}
        {props.pageType === 'edit' && (
          <div className={styles.buttons}>
            <Button className={styles.margin_right_20}>保存</Button>
            <Button ghost>删除</Button>
          </div>
        )}
      </Form>
    </div>
  );
};
