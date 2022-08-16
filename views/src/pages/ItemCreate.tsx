import React from 'react';

import styles from './ItemCreate.module.scss';
import { Tabs, TabPane } from '~/components/Tabs';
import { Icon } from '~/components/Icon';

export const ItemCreate: React.FC = () => {
  const [dataPickerVisible, setDataPickerVisible] = React.useState(false);

  console.log(dataPickerVisible);

  return (
    <div className={styles.container}>
      <Tabs activeKey='expenditure' className={styles.tabs}>
        <TabPane dataKey='expenditure' tab='支出'>支出</TabPane>
        <TabPane dataKey='income' tab='收入'>收入</TabPane>
      </Tabs>
      <div className={styles.calculator}>
        <div className={styles.calculator_screen}>
          <div onClick={() => setDataPickerVisible(prev => !prev)}>
            <Icon icon='date' className={styles.calculator_date_icon} />
            <span className={styles.calculator_date}>2022/08/16</span>
          </div>
          <span className={styles.calculator_value}>19940515</span>
        </div>
        <div className={styles.calculator_panel}>
          <ol>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>删除</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>清空</li>
            <li>7</li>
            <li>8</li>
            <li>9</li>
            <li>提交</li>
            <li>0</li>
            <li>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
