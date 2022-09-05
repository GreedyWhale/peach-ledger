import React from 'react';
import { atom, useSetAtom, useAtomValue, Provider } from 'jotai';
import { atomWithImmer } from 'jotai/immer';

import styles from './Tabs.module.scss';

interface TabsItem { tab: React.ReactNode, key: number | string }

interface Store {
  activeKey: TabsItem['key'];
  tabs: TabsItem[];
}

type Action = { type: 'updateActiveKey', payload: Store['activeKey'] }
| { type: 'updateTabs', payload: TabsItem };

interface TabsProps {
  activeKey: TabsItem['key'];
  className?: string;
  onClick?: (_key: TabsItem['key']) => void;
}

interface TabPaneProps {
  tab: TabsItem['tab'];
  dataKey: TabsItem['key'];
}

const tabStoreScope = Symbol('tabStoreScope');

export const storeAtom = atomWithImmer<Store>({
  activeKey: '',
  tabs: [],
});

const dispatchAtom = atom<null, Action>(null, (get, set, action) => {
  switch (action.type) {
    case 'updateActiveKey':
      set(storeAtom, draft => { draft.activeKey = action.payload; });
      break;
    case 'updateTabs': {
      const newTabs = [...get(storeAtom).tabs, action.payload].filter(function (this: Set<TabsItem['key']>, value) {
        return !this.has(value.key) && this.add(value.key);
      }, new Set());

      set(storeAtom, draft => { draft.tabs = newTabs; });
      break;
    }

    default:
      break;
  }
});

export const TabsInner: React.FC<React.PropsWithChildren<TabsProps>> = props => {
  const store = useAtomValue(storeAtom, tabStoreScope);
  const storeReducer = useSetAtom(dispatchAtom, tabStoreScope);

  React.useEffect(() => {
    storeReducer({ type: 'updateActiveKey', payload: props.activeKey });
  }, [props.activeKey, storeReducer]);

  return (
    <div className={[styles.container, props.className || ''].join(' ')}>
      <ul className={styles.tabs}>
        {store.tabs.map(value => (
          <li
            key={value.key}
            data-active={store.activeKey === value.key}
            onClick={() => {
              storeReducer({ type: 'updateActiveKey', payload: value.key });
              if (props.onClick) {
                props.onClick(value.key);
              }
            }}
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
  const store = useAtomValue(storeAtom, tabStoreScope);
  const storeReducer = useSetAtom(dispatchAtom, tabStoreScope);

  React.useEffect(() => {
    storeReducer({
      type: 'updateTabs',
      payload: { tab: props.tab, key: props.dataKey },
    });
  }, [props.dataKey, props.tab, storeReducer]);

  if (store.activeKey !== props.dataKey) {
    return <></>;
  }

  return (
    <div className={styles.tab_pane}>
      {props.children}
    </div>
  );
};

export const Tabs: React.FC<React.PropsWithChildren<TabsProps>> = props => (
  <Provider scope={tabStoreScope}>
    <TabsInner {...props} />
  </Provider>
);

