import React, { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { atomWithImmer } from 'jotai/immer';
import { Provider, useAtom } from 'jotai';

import styles from './TagLayout.module.scss';
import { Form, FormItem } from '~/components/Form';
import { Button } from '~/components/Button';
import { showDialog } from '~/components/Dialog';

import { showEmoji } from '~/hooks/useEmoji';
import { useUser } from '~/hooks/useUser';
import { Rules, validator } from '~/utils/validator';
import { createTags, AccountType } from '~/service/tags';

type Errors = Partial<Record<'name' | 'emoji', string[]>>;

interface Store {
  emoji: string[];
  name: string;
  errors: Errors;
}

interface TagLayoutProps {
  pageType: 'create' | 'edit';
}

const formRules: Rules<Pick<Store, 'name' | 'emoji'>> = [
  { key: 'name', message: '标签名是必要的', required: true },
  { key: 'name', message: '标签名格式错误', required: name => /^.{2,4}$/gm.test(name as string) },
  { key: 'emoji', message: '符号是必要的', required: emoji => Boolean((emoji as string[]).length) },
];

const tagLayoutScope = Symbol('TagLayoutScope');
const storeAtom = atomWithImmer<Store>({
  emoji: [],
  name: '',
  errors: {},
});

export const TagLayoutInner: React.FC<React.PropsWithChildren<TagLayoutProps>> = props => {
  const { user, showSignInDialog } = useUser();
  const [store, setStore] = useAtom(storeAtom, tagLayoutScope);
  const { category } = useParams<{ category: AccountType }>();

  const handleCreateTag = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validator({ emoji: store.emoji, name: store.name.trim() }, formRules);

    if (errors) {
      setStore(draft => { draft.errors = errors; });
      return;
    }

    if (showSignInDialog()) {
      return;
    }

    await createTags({
      name: store.name,
      emoji: store.emoji,
      user_id: user!.id,
      category: category || 'expenses',
    });

    showDialog({ content: '创建成功' });
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
          error={store.errors.emoji?.[0]}
          label={<>符号：{store.emoji && <span>{showEmoji(store.emoji)}</span>}</>}
          onSelect={emoji => setStore(draft => { draft.emoji = emoji; })}
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
