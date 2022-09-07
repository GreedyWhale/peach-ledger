import React from 'react';

import styles from './ItemList.module.scss';
import { Pagination } from '~/components/Pagination';
import { DateTabsLayout } from '~/components/DateTabsLayout';

import { showEmoji } from '~/hooks/useEmoji';
import { getItems, deleteItem } from '~/service/items';
import { formatDate } from '~/utils/date';
import useSwipe from '~/hooks/useSwipe';

export const ItemList: React.FC = () => (
  <div className={styles.container}>
    <DateTabsLayout component={Item} />
  </div>
);

const Item: React.FC<{ date: string[]; }> = props => {
  const [itemsData, setItemsData] = React.useState<AsyncReturnType<typeof getItems>['data']>({
    items: [],
    balance: {
      total_expenses: 0,
      total_income: 0,
    },
    pagination: {
      current_page: 1,
      first_page: false,
      last_page: false,
      next_page: null,
      prev_page: null,
      total_pages: 1,
    },
  });
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const itemElementsRef = React.useRef<(HTMLLIElement | null)[]>([]);

  useSwipe({
    elementRef: itemElementsRef,
    onSwipeLeft(index?) {
      if (index !== undefined) {
        setActiveIndex(index);
      }
    },
    onSwipeRight: () => setActiveIndex(-1),
  });

  const fetchItems = React.useCallback((page = 1) => {
    let abort = false;
    const abortController = new AbortController();
    getItems({
      page,
      start_date: `${Math.floor(new Date(props.date[0]).getTime() / 1000)}`,
      end_date: `${Math.floor(new Date(props.date[1]).getTime() / 1000)}`,
    }, abortController.signal).then(res => {
      if (abort) {
        return;
      }

      setItemsData(res.data);
    });

    return () => {
      abortController.abort();
      abort = true;
    };
  }, [props.date]);

  React.useEffect(() => {
    const unsubscribe = fetchItems();

    return unsubscribe;
  }, [fetchItems]);

  return (
    <div>
      <ul className={styles.summary}>
        <li><span>收入</span><span>{itemsData.balance.total_income / 100}</span></li>
        <li><span>支出</span><span>{itemsData.balance.total_expenses / 100}</span></li>
        <li><span>净收入</span><span>{(itemsData.balance.total_income - itemsData.balance.total_expenses) / 100}</span></li>
      </ul>

      <ol className={styles.items}>
        {itemsData.items.map((item, index) => (
          <li
            key={item.id}
            ref={el => { itemElementsRef.current[index] = el; }}
            data-active={activeIndex === index}
          >
            <div className={styles.item_left}>
              <div className={styles.icon}>{showEmoji(item.tags.emoji)}</div>
              <div>
                <h2>
                  {item.tags.name}
                  {item.note && (<span>（{item.note}）</span>)}
                </h2>
                <p>{formatDate(new Date(item.created_at))}</p>
              </div>
            </div>
            <span className={styles.amount}>¥{item.amount / 100}</span>
            <span
              className={styles.delete_button}
              onClick={() => {
                deleteItem(item.id);
                fetchItems(itemsData.pagination.current_page);
              }}
            >
              删除
            </span>
          </li>
        ))}
      </ol>

      <Pagination
        totalPage={itemsData.pagination.total_pages || 1}
        currentPage={itemsData.pagination.current_page || 1}
        renderAmount={4}
        onClick={index => fetchItems(index)}
      />
    </div>
  );
};
