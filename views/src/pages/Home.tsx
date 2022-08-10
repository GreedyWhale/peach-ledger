import { Icon } from '~/components/Icon';

import styles from './Home.module.scss';

export const Home = () => {
  console.log(1);

  return (
    <div className={styles.container}>
      <Icon icon='logo' className={styles.logo} />
    </div>
  );
};
