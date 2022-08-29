import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Home.module.scss';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const toItemCreatePage = () => navigate('/item/create');
  return (
    <div className={styles.container}>
      <Icon icon='logo' className={styles.logo} />
      <Button className={styles.start_button} onClick={async () => toItemCreatePage()}>开始记账</Button>
      <Icon icon='add'className={styles.float_button} onClick={toItemCreatePage} />
    </div>
  );
};
