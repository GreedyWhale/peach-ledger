import React from 'react';

import styles from './Collapse.module.scss';
import { Icon } from '~/components/Icon';

interface CollapseProps {
  title: string;
  onClick?: (_isExpanded: boolean) => void;
  controlled?: boolean;
  expand?: boolean;
}

export const Collapse: React.FC<React.PropsWithChildren<CollapseProps>> = props => {
  const [expand, setExpand] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const contextElement = React.useRef<HTMLElement>(null);

  const handleClick = () => {
    if (props.controlled) {
      props.onClick?.(!props.expand);
    } else {
      setExpand(prev => !prev);
      props.onClick?.(!expand);
    }
  };

  React.useEffect(() => {
    if (props.controlled) {
      setExpand(Boolean(props.expand));
    }
  }, [props.controlled, props.expand]);

  React.useEffect(() => {
    if (expand && contextElement.current) {
      setHeight(contextElement.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expand]);

  return (
    <div className={styles.container} data-expanded={expand}>
      <header onClick={handleClick}>
        <span>{props.title}</span>
        <Icon icon='triangle' className={styles.triangle} />
      </header>
      <main ref={contextElement} style={{ height }}>{props.children}</main>
    </div>
  );
};
