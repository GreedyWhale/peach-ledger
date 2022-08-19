import React from 'react';
import * as dayjs from 'dayjs';
import { useImmer } from 'use-immer';

import styles from './ItemList.module.scss';
import { Tabs, TabPane } from '~/components/Tabs';
import { Pagination } from '~/components/Pagination';
import { Form, FormItem } from '~/components/Form';
import { validator, Rules } from '~/utils/validator';

import { showEmoji } from '~/hooks/useEmoji';

export const ItemList: React.FC = () => {
  const [customDate, setCustomDate] = React.useState([
    dayjs().format('YYYY/MM/DD'),
    dayjs().add(7, 'days').format('YYYY/MM/DD'),
  ]);
  const [errors, setErrors] = useImmer({
    endDate: [],
  });

  const updateDate: ItemProps['updateDate'] = (date, key) => {
    const formRules: Rules<{endDate: string}> = [
      {
        key: 'endDate',
        required: endDate => !(dayjs(endDate).isSame(dayjs(customDate[0]))),
        message: '结束时间不能和开始时间相同',
      },
      {
        key: 'endDate',
        required: endDate => !(dayjs(endDate).isBefore(dayjs(customDate[0]))),
        message: '结束时间不能早于开始时间',
      },
    ];

    if (key === 'start') {
      setCustomDate([date, dayjs(date).add(7, 'days').format('YYYY/MM/DD')]);
      return;
    }

    const errors = validator({ endDate: date }, formRules);

    if (errors) {
      setErrors(draft => {
        Object.assign(draft, errors);
      });
      return;
    }

    setCustomDate(prev => ([prev[0], date]));
  };

  return (
    <div className={styles.container}>
      <Tabs activeKey='currentMonth'>
        <TabPane dataKey='currentMonth' tab='本月'>
          <Item
            date={[
              dayjs().startOf('M').format('YYYY/MM/DD'),
              dayjs().endOf('M').format('YYYY/MM/DD'),
            ]}
            disabled
          />
        </TabPane>
        <TabPane dataKey='previousMonth' tab='上个月'>
          <Item
            date={[
              dayjs().subtract(1, 'M').startOf('M').format('YYYY/MM/DD'),
              dayjs().subtract(1, 'M').endOf('M').format('YYYY/MM/DD'),
            ]}
            disabled
          />
        </TabPane>
        <TabPane dataKey='currentYear' tab='今年'>
          <Item
            date={[
              dayjs().startOf('y').format('YYYY/MM/DD'),
              dayjs().endOf('y').format('YYYY/MM/DD'),
            ]}
            disabled
          />
        </TabPane>
        <TabPane dataKey='customDate' tab='自定义时间'>
          <Item
            date={customDate}
            updateDate={updateDate}
            errors={['', errors.endDate[0]]}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

interface ItemProps {
  date: string[];
  errors?: string[];
  disabled?: boolean;
  updateDate?: (_date: string, _key: 'start' | 'end') => void;
}

const Item: React.FC<ItemProps> = props => {
  const fakeData = [
    { id: 1, tag: { sign: ['1F680'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
    { id: 2, tag: { sign: ['1F6EB'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
    { id: 3, tag: { sign: ['1F6EB'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
    { id: 4, tag: { sign: ['1F6EB'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
    { id: 5, tag: { sign: ['1F6EB'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
    { id: 6, tag: { sign: ['1F6EB'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
    { id: 7, tag: { sign: ['1F6EB'], name: '旅行' }, amount: 1000, date: '2022/12/12' },
  ];

  return (
    <div>
      <Form className={styles.form}>
        <FormItem
          label='开始时间：'
          type='date'
          value={props.date[0]}
          onDate={date => props.updateDate?.(date, 'start')}
          error={props.errors?.[0]}
          disabled={props.disabled}
        />
        <FormItem
          label='结束时间：'
          type='date'
          value={props.date[1]}
          onDate={date => props.updateDate?.(date, 'end')}
          error={props.errors?.[1]}
          disabled={props.disabled}
        />
      </Form>

      <ul className={styles.summary}>
        <li><span>收入</span><span>2000</span></li>
        <li><span>支出</span><span>1000</span></li>
        <li><span>净收入</span><span>1000</span></li>
      </ul>

      <ol className={styles.items}>
        {fakeData.map(item => (
          <li key={item.id}>
            <div className={styles.item_left}>
              <div className={styles.icon}>{showEmoji(item.tag.sign)}</div>
              <div>
                <h2>{item.tag.name}</h2>
                <p>{item.date}</p>
              </div>
            </div>
            <span className={styles.amount}>¥{item.amount}</span>
          </li>
        ))}
      </ol>

      <Pagination
        totalPage={100}
        currentPage={1}
        renderAmount={4}
        onClick={index => console.log(index)}
      />
    </div>
  );
};
