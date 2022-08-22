import React from 'react';
import { Collapse } from './Collapse';

import styles from './DatePicker.module.scss';

import { getDateList, enWeeks } from '~/utils/date';

export interface DatePickerProps {
  onFinish: (_date: string) => void;
  onCancel: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = props => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [formData, setFormData] = React.useState({
    year: '',
    month: '',
    date: '',
  });

  const Years = React.useCallback(() => {
    const startYear = new Date().getFullYear() - 10;
    const years = Array.from({ length: 10 }, (value, index) => `${startYear + index + 1}`);
    return (
      <ol className={styles.years}>
        {years.map(year => (
          <li
            key={year}
            data-active={formData.year === year}
            onClick={() => {
              setFormData(prev => ({ ...prev, year }));
              setActiveIndex(1);
            }}
          >
            {year}
          </li>
        ))}
      </ol>
    );
  }, [formData.year]);

  const Months = React.useCallback(() => {
    const months = [
      { name: '一月', value: '01' },
      { name: '二月', value: '02' },
      { name: '三月', value: '03' },
      { name: '四月', value: '04' },
      { name: '五月', value: '05' },
      { name: '六月', value: '06' },
      { name: '七月', value: '07' },
      { name: '八月', value: '08' },
      { name: '九月', value: '09' },
      { name: '十月', value: '10' },
      { name: '十一月', value: '11' },
      { name: '十二月', value: '12' },
    ];

    return (
      <ol className={styles.months}>
        {months.map(month => (
          <li
            key={month.name}
            data-active={formData.month === month.value}
            onClick={() => {
              setFormData(prev => ({ ...prev, month: month.value }));
              setActiveIndex(2);
            }}
          >
            {month.name}
          </li>
        ))}
      </ol>
    );
  }, [formData.month]);

  const Dates = React.useCallback(() => {
    if (!formData.year || !formData.month) {
      return <></>;
    }

    const dateList = getDateList(parseInt(formData.year, 10), parseInt(formData.month, 10));
    return (
      <ol className={styles.date}>
        {enWeeks.map(week => (<li key={week}>{week}</li>))}
        {dateList.map(date => (
          <li
            data-hidden={!date.visible}
            key={date.value}
            onClick={() => {
              const formattedDate = date.value.padStart(2, '0');
              setFormData(prev => ({ ...prev, date: formattedDate }));
              props.onFinish(`${formData.year}/${formData.month}/${formattedDate}`);
            }}
          >
            {date.value}
          </li>
        ))}
      </ol>
    );
  }, [formData.month, formData.year, props]);

  const collapseList = React.useMemo(() => ([
    { title: formData.year || 'Year', children: <Years /> },
    { title: formData.month || 'Month', children: <Months /> },
    { title: formData.date || 'Date', children: <Dates /> },
  ]), [formData.year, formData.month, formData.date, Years, Months, Dates]);

  const handleClick = (index: number) => {
    if (!formData.year && index !== 0) {
      return;
    }

    if (!formData.month && index > 1) {
      return;
    }

    setActiveIndex(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mask} onClick={props.onCancel} />
      <div className={styles.date_picker}>
        {collapseList.map((value, index) => (
          <Collapse
            key={value.title}
            title={value.title}
            expand={activeIndex === index}
            onClick={() => handleClick(index)}
            controlled
          >
            {value.children}
          </Collapse>
        ))}
      </div>
    </div>
  );
};
