
import styles from './Home.module.scss';
import { Icon } from '~/components/Icon';
import { Button } from '~/components/Button';

export const Home = () => {
  console.log(1);

  return (
    <div className={styles.container}>
      <Icon icon='logo' className={styles.logo} />
      <Button className={styles.start_button}>开始记账</Button>
      <Icon icon='add'className={styles.float_button}/>
    </div>
  );
};
