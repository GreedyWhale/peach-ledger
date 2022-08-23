import React from 'react';

import styles from './ItemList.module.scss';
import { Pagination } from '~/components/Pagination';
import { DateTabsLayout } from '~/components/DateTabsLayout';

import { showEmoji } from '~/hooks/useEmoji';

export const ItemList: React.FC = () => (
  <div className={styles.container}>
    <DateTabsLayout component={Item} />
  </div>
);

interface ItemProps {
  date: string[];
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

  console.log(props.date);

  return (
    <div>
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
