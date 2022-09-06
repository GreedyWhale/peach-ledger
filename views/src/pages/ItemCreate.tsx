import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';

import styles from './ItemCreate.module.scss';
import { Tabs, TabPane } from '~/components/Tabs';
import { Icon } from '~/components/Icon';
import { DatePicker } from '~/components/DatePicker';
import { FormItem } from '~/components/Form';

import { formatDate } from '~/utils/date';
import { showEmoji } from '~/hooks/useEmoji';
import { getTags, TagsResponse, AccountType } from '~/service/tags';

const calculatorButtons = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: 'delete', text: '删除' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: 'clear', text: '清空' },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: 'submit', text: '提交' },
  { value: '0' },
  { value: '.' },
];

const tabs = [
  { category: 'expenses', tab: '支出' },
  { category: 'income', tab: '收入' },
];

export const ItemCreate: React.FC = () => {
  const navigate = useNavigate();
  const [dataPickerVisible, setDataPickerVisible] = React.useState(false);
  const [formData, setFormData] = useImmer({
    amount: '0',
    tag: {
      name: '',
      emoji: '',
    },
    date: formatDate(),
    note: '',
  });
  const [activatedTabKey, setActivatedTabKey] = React.useState<AccountType>('expenses');
  const [expensesTags, setExpensesTags] = React.useState<TagsResponse>([]);
  const [incomeTags, setIncomeTags] = React.useState<TagsResponse>([]);
  const longPressTimer = React.useRef(-1);

  const handleCalculator = (value: string | 'delete' | 'clear' | 'submit') => {
    const dotReg = /\./gm;
    if (value === 'submit') {
      console.log('submit');
      return;
    }

    if (value === 'clear') {
      setFormData(draft => {
        draft.amount = '0';
      });
      return;
    }

    if (value === 'delete') {
      if (formData.amount === '0') {
        return;
      }

      if (formData.amount.length === 1) {
        setFormData(draft => {
          draft.amount = '0';
        });
        return;
      }

      setFormData(draft => {
        draft.amount = draft.amount.substring(0, formData.amount.length - 1);
      });
      return;
    }

    if (formData.amount.length >= 16) {
      return;
    }

    if (value === '.') {
      // 已经存在点
      if (dotReg.test(formData.amount)) {
        return;
      }

      setFormData(draft => {
        draft.amount += value;
      });
      return;
    }

    if (value === '0') {
      if (!dotReg.test(formData.amount) && formData.amount === '0') { // 不存在点且已经有0
        return;
      }
    }

    const float = formData.amount.split('.')[1];

    if (float && float.length >= 2) {
      return;
    }

    setFormData(draft => {
      draft.amount = draft.amount === '0' ? value : draft.amount + value;
    });
  };

  const handleDate = (date: string) => {
    setFormData(draft => {
      draft.date = date;
    });
    setDataPickerVisible(false);
  };

  const handleTouchStart = (id: number) => {
    handleTouchEnd();
    longPressTimer.current = window.setTimeout(() => {
      navigate(`/tag/update/${id}`);
    }, 2000);
  };

  const handleTouchEnd = () => {
    window.clearTimeout(longPressTimer.current);
  };

  React.useEffect(() => {
    let abort = false;
    const abortController = new AbortController();
    getTags(activatedTabKey, abortController.signal)
      .then(res => {
        if (abort) {
          return;
        }

        if (activatedTabKey === 'expenses') {
          setExpensesTags(res.data);
        }

        if (activatedTabKey === 'income') {
          setIncomeTags(res.data);
        }
      });

    return () => {
      abortController.abort();
      abort = true;
    };
  }, [activatedTabKey]);

  return (
    <div className={styles.container}>
      <Tabs
        activeKey={activatedTabKey}
        className={styles.tabs}
        onClick={key => setActivatedTabKey(key as AccountType)}
      >
        {tabs.map(item => (
          <TabPane dataKey={item.category} tab={item.tab} key={item.category}>
            <ul className={styles.tags}>
              <li>
                <span>
                  <Icon
                    icon='addSquare'
                    className={styles.add_icon}
                    onClick={() => navigate(`/tag/create/${item.category}`)}
                  />
                </span>
              </li>
              {item.category === 'expenses' && (
                expensesTags.map(tag => (
                  <li
                    key={tag.id}
                    onTouchStart={() => handleTouchStart(tag.id)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <span>{showEmoji(tag.emoji)}</span>
                    <span>{tag.name}</span>
                  </li>
                ))
              )}
              {item.category === 'income' && (
                incomeTags.map(tag => (
                  <li
                    key={tag.id}
                    onTouchStart={() => handleTouchStart(tag.id)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <span>{showEmoji(tag.emoji)}</span>
                    <span>{tag.name}</span>
                  </li>
                ))
              )}
            </ul>
          </TabPane>
        ))}
      </Tabs>
      <div className={styles.calculator}>
        <FormItem
          className={styles.item_note}
          type='text'
          label='备注：'
          value={formData.note}
          onChange={event => setFormData(draft => { draft.note = event.target.value; })}
          placeholder='账目备注，选填'
        />
        <div className={styles.calculator_screen}>
          <div onClick={() => setDataPickerVisible(prev => !prev)}>
            <Icon icon='date' className={styles.calculator_date_icon} />
            <span className={styles.calculator_date}>{formData.date}</span>
          </div>
          <span className={styles.calculator_value}>{formData.amount}</span>
        </div>
        <div className={styles.calculator_panel}>
          <ol>
            {calculatorButtons.map(item => (
              <li key={item.value} onClick={() => handleCalculator(item.value)}>
                {item.text || item.value}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {dataPickerVisible && <DatePicker onFinish={handleDate} onCancel={() => setDataPickerVisible(false)} />}
    </div>
  );
};
