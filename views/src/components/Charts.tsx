import type { AccountType } from '~/service/tags';

import React from 'react';
import * as echarts from 'echarts';

import styles from './Charts.module.scss';
import { Form, FormItem } from '~/components/Form';

import { getItems } from '~/service/items';
import { toSeconds, formatDate } from '~/utils/date';
import { showEmoji } from '~/hooks/useEmoji';

interface ChartsProps {
  date: string[];
}

type DataSource = AsyncReturnType<typeof getItems>['data'];

const LineChart: React.FC<{ dataSource: DataSource }> = props => {
  const elementRef = React.useRef(null);

  const chartData = React.useMemo(() => {
    const xAxisData: string[] = [];
    const seriesDataMap = new Map();
    if (props.dataSource.items.length) {
      props.dataSource.items.forEach(value => {
        const date = formatDate(new Date(value.date));
        const amount = seriesDataMap.has(date) ? seriesDataMap.get(date) + value.amount : value.amount;
        xAxisData.push(date);
        seriesDataMap.set(date, amount);
      });
    }

    return {
      xAxisData: [...new Set(xAxisData)],
      seriesData: [...seriesDataMap.values()].map(value => value / 100),
    };
  }, [props.dataSource]);

  React.useEffect(() => {
    const option: echarts.EChartsOption = {
      xAxis: {
        type: 'category',
        data: chartData.xAxisData,
      },
      yAxis: {
        name: '金额(¥)',
        type: 'value',
        splitLine: {
          lineStyle: { color: '#1A1E23' },
        },
      },
      series: [
        {
          data: chartData.seriesData,
          type: 'line',
          smooth: true,
        },
      ],
    };
    let chartInstance: null | echarts.ECharts = null;
    if (elementRef.current) {
      chartInstance = echarts.init(elementRef.current);
      chartInstance.setOption(option);
    }

    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [chartData.seriesData, chartData.xAxisData]);

  return (
    <div ref={elementRef} className={styles.chart_wrap}></div>
  );
};

const PieChart: React.FC<{ dataSource: DataSource }> = props => {
  const elementRef = React.useRef(null);
  const chartData = React.useMemo(() => {
    const seriesDataMap = new Map();
    props.dataSource.items.forEach(value => {
      const amount = seriesDataMap.has(value.name) ? seriesDataMap.get(value.name) + value.amount : value.amount;
      seriesDataMap.set(value.name, amount);
    });

    return [...seriesDataMap.entries()].map(item => ({ name: item[0], value: item[1] / 100 }));
  }, [props.dataSource]);

  React.useEffect(() => {
    const option: echarts.EChartsOption = {
      series: [
        {
          type: 'pie',
          radius: '80%',
          data: chartData,
          label: {
            formatter: '{b} - {c}({d}%)',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    let chartInstance: null | echarts.ECharts = null;
    if (elementRef.current) {
      chartInstance = echarts.init(elementRef.current);
      chartInstance.setOption(option);
    }

    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [chartData]);

  return (
    <div ref={elementRef} className={styles.chart_wrap}></div>
  );
};

const BarChart: React.FC<{ dataSource: DataSource }> = props => {
  const chartData: {
    name: string;
    percent: string;
    amount: number;
    emoji: string[];
  }[] = React.useMemo(() => {
    const dataMap = new Map();
    let totalAmount = 0;

    props.dataSource.items.forEach(value => {
      totalAmount += value.amount;
      const amount = dataMap.has(value.name) ? dataMap.get(value.name).amount + value.amount : value.amount;
      dataMap.set(value.name, { amount, emoji: value.tags.emoji });
    });

    return [...dataMap.entries()]
      .map(item => ({ name: item[0], percent: `${((item[1].amount / totalAmount) * 100).toFixed(2)}%`, ...item[1] }))
      .sort((a, b) => b.amount - a.amount);
  }, [props.dataSource]);

  return (
    <div>
      {chartData.map(value => (
        <div className={styles.bar_chart} key={value.name}>
          <div className={styles.bar_chart_icon}>{showEmoji(value.emoji)}</div>
          <div className={styles.bar_chart_right}>
            <div className={styles.bar_chart_item}>
              <span>{value.name} - {value.percent}</span>
              <span>￥{value.amount / 100}</span>
            </div>
            <div className={styles.bar_chart_progress} style={{ width: `${value.percent}` }}>
              <span></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Charts: React.FC<ChartsProps> = props => {
  const [type, setType] = React.useState<AccountType>('expenses');
  const [itemsData, setItemsData] = React.useState<DataSource>({
    balance: { total_expenses: 0, total_income: 0 },
    items: [],
    pagination: {
      total_pages: 1,
      current_page: 1,
      next_page: null,
      prev_page: null,
      first_page: false,
      last_page: false,
    },
  });
  const dataSource = React.useMemo(() => ({
    ...itemsData,
    items: itemsData.items.filter(value => value?.category === type),
  }), [type, itemsData]);

  const fetchData = React.useCallback(() => {
    let abort = false;
    const abortController = new AbortController();

    getItems({
      page: -1,
      start_date: `${toSeconds(props.date[0])}`,
      end_date: `${toSeconds(props.date[1])}`,
      sort: 'ASC',
    }, abortController.signal)
      .then(res => {
        if (abort) { return; }

        setItemsData(res.data);
      });

    return () => {
      abortController.abort();
      abort = true;
    };
  }, [props.date]);

  React.useEffect(() => fetchData(), [fetchData]);

  return (
    <div className={styles.container}>
      <Form className={styles.form_wrap}>
        <FormItem
          label='类型：'
          type='radio'
          options={[
            { key: '支出', value: 'expenses' },
            { key: '收入', value: 'income' },
          ]}
          value={type}
          onChange={element => setType(element.target.value as AccountType)}
        />
      </Form>

      <LineChart dataSource={dataSource} />
      <PieChart dataSource={dataSource} />
      <BarChart dataSource={dataSource} />
    </div>
  );
};
