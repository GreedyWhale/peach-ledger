import React from 'react';
import * as echarts from 'echarts';

import styles from './Charts.module.scss';
import { Form, FormItem } from '~/components/Form';

interface ChartsProps {
  date: string[];
}

const LineChart = () => {
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const option: echarts.EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: { color: '#1A1E23' },
        },
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
        },
      ],
      grid: {
        left: '12%',
        right: 0,
        top: 20,
        bottom: 20,
      },
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
  }, []);

  return (
    <div ref={elementRef} className={styles.chart_wrap}></div>
  );
};

const PieChart = () => {
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const option: echarts.EChartsOption = {
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
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
  }, []);

  return (
    <div ref={elementRef} className={styles.chart_wrap}></div>
  );
};

const BarChart = () => {
  console.log('BarChart');

  return (
    <div className={styles.bar_chart}>
      <div className={styles.bar_chart_icon}></div>
      <div className={styles.bar_chart_right}>
        <div className={styles.bar_chart_item}>
          <span>机票 - 63%</span>
          <span>￥1234.2</span>
        </div>
        <div className={styles.bar_chart_progress}>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export const Charts: React.FC<ChartsProps> = () => {
  const [type, setType] = React.useState('expenses');

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
          onChange={element => setType(element.target.value)}
        />
      </Form>

      <LineChart />
      <PieChart />
      <BarChart />
    </div>
  );
};
