import React from 'react';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import styles from './Tabs.module.scss';

interface TabsItem { tab: React.ReactNode, key: number | string }
interface InitialStore {
  activeKey: TabsItem['key'];
  tabs: TabsItem[];
}
interface Store extends InitialStore{
  setActiveKey: (_key: TabsItem['key']) => void;
  setTabs: (_tab: TabsItem) => void;
  resetStore: () => void;
}

interface TabsProps {
  activeKey: TabsItem['key'];
  className?: string;
}

interface TabPaneProps {
  tab: TabsItem['tab'];
  dataKey: TabsItem['key'];
}

const initialStore: InitialStore = {
  activeKey: '',
  tabs: [],
};

const useStore = create<Store>()(
  devtools(
    immer((set, get) => ({
      ...initialStore,

      setActiveKey: key => set(state => {
        state.activeKey = key;
      }),
      setTabs: tab => set(state => {
        const result = [...get().tabs, tab].filter(function (this: Set<TabsItem['key']>, value) {
          return !this.has(value.key) && this.add(value.key);
        }, new Set());

        state.tabs = result;
      }),
      resetStore: () => set(initialStore),
    })),
  ),
);

export const Tabs: React.FC<React.PropsWithChildren<TabsProps>> = props => {
  const tabs = useStore(state => state.tabs);
  const activeKey = useStore(state => state.activeKey);
  const { setActiveKey, resetStore } = useStore.getState();

  React.useEffect(() => {
    setActiveKey(props.activeKey);
  }, [props.activeKey, setActiveKey]);

  React.useEffect(() => resetStore, [resetStore]);

  return (
    <div className={[styles.container, props.className || ''].join(' ')}>
      <ul className={styles.tabs}>
        {tabs.map(value => (
          <li
            key={value.key}
            data-active={activeKey === value.key}
            onClick={() => setActiveKey(value.key)}
          >
            {value.tab}
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  );
};

export const TabPane: React.FC<React.PropsWithChildren<TabPaneProps>> = props => {
  const activeKey = useStore(state => state.activeKey);
  const { setTabs } = useStore.getState();

  React.useEffect(() => {
    setTabs({ tab: props.tab, key: props.dataKey });
  }, [props.dataKey, props.tab, setTabs]);

  return (
    <div className={styles.tab_pane} data-visible={activeKey === props.dataKey}>
      {props.children}
    </div>
  );
};

