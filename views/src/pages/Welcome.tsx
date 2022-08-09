import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './welcome.module.scss';
import { Icon, IconProps } from '~/components/Icon';

import useSwipe from '~/hooks/useSwipe';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = React.useState(1);

  const rootElement = React.useRef<HTMLDivElement>(null);

  const pageContents = React.useMemo(() => {
    const contents: Record<string, {icon: IconProps['icon'], text: string[]}> = {
      1: { icon: 'money', text: ['会挣钱', '还要会省钱'] },
      2: { icon: 'dashboard', text: ['每日提醒', '不遗漏每一笔账单'] },
      3: { icon: 'chart', text: ['数据可视化', '收支一目了然'] },
      4: { icon: 'global', text: ['云备份', '再也不怕数据丢失'] },
    };

    return contents[step];
  }, [step]);

  const toHome = React.useCallback(() => navigate('/home', { replace: true }), [navigate]);
  const handleSwipeRight = React.useCallback(() => {
    setStep(prev => {
      if (prev === 1) {
        return 1;
      }

      return prev - 1;
    });
  }, []);
  const handleSwipeLeft = React.useCallback(() => {
    if (step === 4) {
      toHome();
      return;
    }

    setStep(prev => prev + 1);
  }, [step, toHome]);

  useSwipe({
    elementRef: rootElement,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  return (
    <div className={styles.container} ref={rootElement}>
      <header>
        <Icon icon='logo' className={styles.logo} />
        <h1>桃子记账</h1>
      </header>
      <main>
        <div className={styles.page_contents} data-step={step}>
          <Icon icon={pageContents.icon} className={styles.welcome_icons} />
          <div>
            {pageContents.text.map(item => (
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
