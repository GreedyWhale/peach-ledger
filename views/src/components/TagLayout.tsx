import React, { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atomWithImmer } from 'jotai/immer';
import { Provider, useAtom } from 'jotai';

import styles from './TagLayout.module.scss';
import { Form, FormItem } from '~/components/Form';
import { Button } from '~/components/Button';
import { showDialog } from '~/components/Dialog';

import { showEmoji } from '~/hooks/useEmoji';
import { useUser } from '~/hooks/useUser';
import { Rules, validator } from '~/utils/validator';
import { createTag, getTag, updateTag, deleteTag, AccountType } from '~/service/tags';

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
  { key: 'name', message: '标签名格式错误', required: name => /^.{2,8}$/gm.test(name as string) },
  { key: 'emoji', message: '符号是必要的', required: emoji => Boolean((emoji as string[]).length) },
];

const tagLayoutScope = Symbol('TagLayoutScope');
const storeAtom = atomWithImmer<Store>({
  emoji: [],
  name: '',
  errors: {},
});

export const TagLayoutInner: React.FC<React.PropsWithChildren<TagLayoutProps>> = props => {
  const navigate = useNavigate();
  const { user, showSignInDialog } = useUser();
  const [store, setStore] = useAtom(storeAtom, tagLayoutScope);
  const { category, id } = useParams<{ category: AccountType, id: string }>();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const errors = validator({ emoji: store.emoji, name: store.name.trim() }, formRules);

    if (errors) {
      setStore(draft => { draft.errors = errors; });
      return false;
    }

    if (showSignInDialog()) {
      return false;
    }

    return true;
  };

  const handleUpdate = (id: string | undefined): id is string => {
    if (!id) {
      showDialog({ content: '无法继续，标签不存在' });
      return false;
    }

    return true;
  };

  const handleCreateTag = async (event: FormEvent) => {
    if (handleSubmit(event)) {
      await createTag({
        name: store.name,
        emoji: store.emoji,
        user_id: user!.id,
        category: category || 'expenses',
      });

      showDialog({ content: '创建成功' });
    }
  };

  const handleSave = async (event: FormEvent) => {
    if (handleSubmit(event) && handleUpdate(id)) {
      await updateTag(parseInt(id, 10), { name: store.name, emoji: store.emoji });
      showDialog({ content: '更新成功' });
    }
  };

  const handleDelete = async (event: FormEvent) => {
    if (handleSubmit(event) && handleUpdate(id)) {
      await deleteTag(parseInt(id, 10));
      showDialog({ content: '删除成功', onDestroyed: () => navigate(-1) });
    }
  };

  React.useEffect(() => {
    let abort = false;
    const abortController = new AbortController();
    if (props.pageType === 'edit' && id) {
      getTag(parseInt(id, 10), abortController.signal)
        .then(res => {
          if (abort) { return; }

          setStore(draft => {
            draft.name = res.data.name;
            draft.emoji = res.data.emoji;
          });
        });
    }

    return () => {
      abort = true;
      abortController.abort();
    };
  }, [id, props.pageType, category, setStore]);

  return (
    <div className={styles.container}>
      <Form>
        <FormItem
          type='text'
          label='标签名：'
          value={store.name}
          onChange={event => setStore(draft => { draft.name = event.target.value; })}
          placeholder='2-8个字符'
          maxLength={8}
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
            <Button className={styles.margin_right_20} onClick={handleSave}>保存</Button>
            <Button ghost onClick={handleDelete}>删除</Button>
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
