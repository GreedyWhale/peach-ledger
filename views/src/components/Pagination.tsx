import React from 'react';

import styles from './Pagination.module.scss';

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  renderAmount: number;
  onClick: (_page: number) => void;
  step?: number;
}

export const Pagination: React.FC<PaginationProps> = props => {
  const [unPassed, setUnPassed] = React.useState(false);

  const items = React.useMemo(() => {
    if (props.totalPage <= props.renderAmount) {
      return Array.from({ length: props.totalPage }, (value, index) => index + 1);
    }

    const result = [...new Set([1, props.currentPage, props.totalPage])];
    // 计算左边填充的元素数量
    const numberOfLeftFill = props.currentPage - 1;
    if (numberOfLeftFill) {
      Array.from({ length: numberOfLeftFill }, (value, index) => index + 1)
        .forEach(value => {
          const child = props.currentPage - value;
          if (child > 1 && result.length < props.renderAmount) {
            result.push(child);
          }
        });
    }

    // 计算右边填充的元素数量
    const numberOfRightFill = props.renderAmount - result.length;
    if (numberOfRightFill) {
      Array.from({ length: numberOfRightFill }, (value, index) => index + 1)
        .forEach(value => {
          const child = props.currentPage + value;
          if (child < props.totalPage && result.length < props.renderAmount) {
            result.push(child);
          }
        });
    }

    return result.sort((a, b) => a - b);
  }, [props]);

  const handleClick = (action: 'minus' | 'add' | 'update', payload: number) => {
    switch (action) {
      case 'update':
        props.onClick(payload);
        return;

      case 'minus': {
        let index = props.currentPage - payload;
        if (index < 1) {
          index = 1;
        }

        props.onClick(index);
        return;
      }

      case 'add': {
        let index = props.currentPage + payload;
        if (index > props.totalPage) {
          index = props.totalPage;
        }

        props.onClick(index);
        // eslint-disable-next-line no-useless-return
        return;
      }

      default:
        break;
    }
  };

  React.useEffect(() => {
    const rules = [
      { rule: props.totalPage < 1, message: 'total 必须大于或等于 1' },
      { rule: props.renderAmount < 1, message: 'renderAmount 不能小于1' },
      { rule: props.currentPage > props.totalPage, message: 'currentPage 不能大于 totalPage' },
    ];

    rules.some(item => {
      if (item.rule) {
        setUnPassed(true);
        throw new Error(item.message);
      }

      return item.rule;
    });
  }, [props]);

  return (
    <div className={styles.pagination}>
      {!unPassed && (<ul>
        <li data-disable={props.currentPage === 1} onClick={() => handleClick('minus', 1)}>上一页</li>
        {items.map((item, index) => {
          const prev = items[index - 1];
          const showEllipsis = prev && (item - prev > 1);
          const isAfter = item > props.currentPage;
          return (
            <React.Fragment key={item}>
              {Boolean(showEllipsis) && (
                <li
                  data-ellipsis='true'
                  title={isAfter ? `向后${props.step}页` : `向前${props.step}页`}
                  onClick={() => handleClick(isAfter ? 'add' : 'minus', props.step!)}
                >
                  ...
                </li>
              )}
              <li data-active={props.currentPage === item} onClick={() => handleClick('update', item)}>{item}</li>
            </React.Fragment>
          );
        })}
        <li data-disable={props.currentPage === props.totalPage} onClick={() => handleClick('add', 1)}>下一页</li>
      </ul>)}
    </div>
  );
};

Pagination.defaultProps = {
  step: 5,
};
