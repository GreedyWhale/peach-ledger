import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './welcome.module.scss';
import logo from '~/assets/images/logo.png';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const pageContents = React.useMemo(() => {
    const contents: Record<string, string[]> = {
      1: ['会挣钱', '还要会省钱'],
      2: ['每日提醒', '不遗漏每一笔账单'],
      3: ['数据可视化', '收支一目了然'],
      4: ['云备份', '再也不怕数据丢失'],
    };

    return contents[step];
  }, [step]);

  const toHome = () => navigate('/home', { replace: true });

  return (
    <div className={styles.container}>
      <header>
        <img src={logo} alt='logo' />
        <h1>桃子记账</h1>
      </header>
      <main>
        <div className={styles.page_contents} data-step={step}>
          <span />
          <div>
            {pageContents.map(item => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </main>
      <footer>
        {
          step === 4
            ? <button className={styles.to_home} onClick={toHome}>开启应用</button>
            : (
              <>
                <button onClick={toHome}>跳过</button>
                <button onClick={() => setStep(prev => prev + 1)}>下一页</button>
              </>
            )
        }
      </footer>
    </div>
  );
};
