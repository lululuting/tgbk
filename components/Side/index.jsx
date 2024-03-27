/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2024-01-04 14:52:00
 * @LastEditors: TingGe
 * @Description: 侧边栏
 * @FilePath: /ting_ge_blog/components/Side/index.jsx
 */

import React from 'react';
import { BackTop } from 'antd';
import { BugOutlined, ArrowUpOutlined } from '@ant-design/icons';
import styles from './style.module.less';

const Side = () => {
  return (
    <div className={styles['side']}>
      <div className={styles['action-btn']} onClick={()=>window.scrollTo(0,0)}>
        <ArrowUpOutlined style={{ fontSize: 18 }} />
      </div>

      <div
        className={styles['action-btn']}
        onClick={() => window.open('https://support.qq.com/product/287609')}
      >
        <BugOutlined style={{ fontSize: 18 }} />
      </div>
    </div>
  );
};

const SideForm = Side;
export default SideForm;
