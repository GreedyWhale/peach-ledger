import React from 'react';

import styles from './ItemCharts.module.scss';
import { DateTabsLayout } from '~/components/DateTabsLayout';
import { Charts } from '~/components/Charts';

export const ItemCharts: React.FC = () => {
  console.log('ItemCharts');

  return (
    <div>
      <DateTabsLayout
        component={props => (
          <div className={styles.container}>
            <Charts {...props}/>
          </div>
        )}
      />
    </div>
  );
};
