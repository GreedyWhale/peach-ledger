import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';

import styles from './ItemCreate.module.scss';
import { Tabs, TabPane } from '~/components/Tabs';
import { Icon } from '~/components/Icon';
import { DatePicker } from '~/components/DatePicker';

import { formatDate } from '~/utils/date';
import { showEmoji } from '~/hooks/useEmoji';

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

const fakeTags = [
  { id: 1, sign: ['1F34B'], name: '测试' },
  { id: 2, sign: ['1F34B'], name: '测试' },
  { id: 3, sign: ['1F34B'], name: '测试' },
  { id: 4, sign: ['1F34B'], name: '测试' },
  { id: 5, sign: ['1F34B'], name: '测试' },
  { id: 6, sign: ['1F34B'], name: '测试' },
  { id: 7, sign: ['1F34B'], name: '测试' },
  { id: 8, sign: ['1F34B'], name: '测试' },
  { id: 9, sign: ['1F34B'], name: '测试' },
  { id: 10, sign: ['1F34B'], name: '测试' },
  { id: 11, sign: ['1F34B'], name: '测试' },
  { id: 12, sign: ['1F34B'], name: '测试' },
  { id: 13, sign: ['1F34B'], name: '测试' },
  { id: 14, sign: ['1F34B'], name: '测试' },
  { id: 15, sign: ['1F34B'], name: '测试' },
  { id: 16, sign: ['1F34B'], name: '测试' },
  { id: 17, sign: ['1F34B'], name: '测试' },
  { id: 18, sign: ['1F34B'], name: '测试' },
  { id: 19, sign: ['1F34B'], name: '测试' },
  { id: 20, sign: ['1F34B'], name: '测试' },
  { id: 21, sign: ['1F34B'], name: '测试' },
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
  });

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

  return (
    <div className={styles.container}>
      <Tabs activeKey='expenditure' className={styles.tabs}>
        <TabPane dataKey='expenditure' tab='支出'>
          <ul className={styles.tags}>
            <li>
              <span>
                <Icon icon='addSquare' className={styles.add_icon} onClick={() => navigate('/tag/create')}/>
              </span>
            </li>
            {fakeTags.map(tag => (
              <li key={tag.id}>
                <span>{showEmoji(tag.sign)}</span>
                <span>{tag.name}</span>
              </li>
            ))}
          </ul>
        </TabPane>
        <TabPane dataKey='income' tab='收入'>收入</TabPane>
      </Tabs>
      <div className={styles.calculator}>
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
      {dataPickerVisible && <DatePicker onFinish={handleDate}/>}
    </div>
  );
};
