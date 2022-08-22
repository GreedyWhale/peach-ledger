import React, { FormEvent } from 'react';
import { atomWithImmer } from 'jotai/immer';
import { Provider, useAtom } from 'jotai';

import styles from './TagLayout.module.scss';
import { Form, FormItem } from '~/components/Form';
import { Button } from '~/components/Button';

import { showEmoji } from '~/hooks/useEmoji';
import { Rules, validator } from '~/utils/validator';

type Errors = Partial<Record<'name' | 'sign', string[]>>;

interface Store {
  sign: string[];
  name: string;
  errors: Errors;
}

interface TagLayoutProps {
  pageType: 'create' | 'edit'
}

const formRules: Rules<Pick<Store, 'name' | 'sign'>> = [
  { key: 'name', message: '标签名是必要的', required: true },
  { key: 'name', message: '标签名格式错误', required: name => /^.{2,4}$/gm.test(name as string) },
  { key: 'sign', message: '符号是必要的', required: sign => Boolean((sign as string[]).length) },
];

const tagLayoutScope = Symbol('TagLayoutScope');
const storeAtom = atomWithImmer<Store>({
  sign: [],
  name: '',
  errors: {},
});

export const TagLayoutInner: React.FC<React.PropsWithChildren<TagLayoutProps>> = props => {
  const [store, setStore] = useAtom(storeAtom, tagLayoutScope);

  const handleCreateTag = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validator({ sign: store.sign, name: store.name.trim() }, formRules);

    if (errors) {
      setStore(draft => { draft.errors = errors; });
      return;
    }

    // TODO 创建 删除 更新逻辑
    console.log('go on');
  };

  return (
    <div className={styles.container}>
      <Form>
        <FormItem
          type='text'
          label='标签名：'
          value={store.name}
          onChange={event => setStore(draft => { draft.name = event.target.value; })}
          placeholder='2-4个字符'
          maxLength={4}
          error={store.errors.name?.[0]}
        />

        <FormItem
          type='emoji'
          error={store.errors.sign?.[0]}
          label={<>符号：{store.sign && <span>{showEmoji(store.sign)}</span>}</>}
          onSelect={emoji => setStore(draft => { draft.sign = emoji; })}
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

export const TagLayout: React.FC<React.PropsWithChildren<TagLayoutProps>> = props => (
  <Provider scope={tagLayoutScope}>
    <TagLayoutInner {...props} />
  </Provider>
);
