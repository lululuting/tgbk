import React, { useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import styles from './style.module.less';


const ArticleSort = (props) => {
  const [key, setKey] = useState(false);

  const sortChang = () => {
    if (props.onChange) {
      props.onChange(!key);
    }
    setKey(!key);
  };

  return (
    <span onClick={sortChang} className={styles['switch-btn']} style={props.style}>
      <SvgIcon name="iconqiehuan" />
      {key ? '热门排序' : '时间排序'}
    </span>
  );
};
export default ArticleSort;
