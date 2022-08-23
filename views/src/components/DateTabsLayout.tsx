import React from 'react';
import * as dayjs from 'dayjs';
import { useImmer } from 'use-immer';

import styles from './DateTabsLayout.module.scss';
import { Tabs, TabPane } from '~/components/Tabs';
import { Form, FormItem } from '~/components/Form';

import { validator, Rules } from '~/utils/validator';

interface DateFormProps {
  date: string[];
  errors?: string[];
  disabled?: boolean;
  updateDate?: (_date: string, _key: 'start' | 'end') => void;
}

interface DateTabsLayoutProps {
  component: React.FunctionComponent<{
    date: string[];
  }>;
}

const DateForm: React.FC<DateFormProps> = props => (
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
);

export const DateTabsLayout: React.FC<DateTabsLayoutProps> = props => {
  const [customDate, setCustomDate] = React.useState([
    dayjs().format('YYYY/MM/DD'),
    dayjs().add(7, 'days').format('YYYY/MM/DD'),
  ]);
  const [errors, setErrors] = useImmer({
    endDate: [],
  });

  const updateDate = React.useCallback((date: string, key: 'start' | 'end') => {
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
  }, [customDate, setErrors]);

  const tabs = React.useMemo(() => ([
    {
      key: 'currentMonth',
      tab: '本月',
      date: [dayjs().startOf('M').format('YYYY/MM/DD'), dayjs().endOf('M').format('YYYY/MM/DD')],
      disable: true,
    },
    {
      key: 'previousMonth',
      tab: '上个月',
      date: [dayjs().subtract(1, 'M').startOf('M').format('YYYY/MM/DD'), dayjs().subtract(1, 'M').endOf('M').format('YYYY/MM/DD')],
      disable: true,
    },
    {
      key: 'currentYear',
      tab: '今年',
      date: [dayjs().startOf('y').format('YYYY/MM/DD'), dayjs().endOf('y').format('YYYY/MM/DD')],
      disable: true,
    },
    {
      key: 'customDate',
      tab: '自定义时间',
      date: customDate,
      disable: false,
      errors: ['', errors.endDate[0]],
      updateDate,
    },
  ]), [customDate, errors, updateDate]);

  return (
    <div className={styles.container}>
      <Tabs activeKey='currentMonth' className={styles.tabs}>
        {tabs.map(tab => (
          <TabPane dataKey={tab.key} tab={tab.tab} key={tab.key}>
            <DateForm
              disabled={tab.disable}
              date={tab.date}
              errors={tab.errors}
              updateDate={tab.updateDate}
            />
            <props.component date={tab.date} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};
