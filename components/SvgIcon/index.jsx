/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2022-11-02 16:51:05
 * @LastEditors: TingGe
 * @Description: svg icon
 * @FilePath: /ting_ge_blog/components/SvgIcon/index.jsx
 */
import React from 'react';
import classNames from 'classnames';
import styles from './index.module.less';
export default (props) => {
  return (
    <>
      <svg
        className={classNames(
          styles.icon,
          styles['svg-icon'],
          props.addClass
        )}
        aria-hidden="true"
        style={props.style}
        onClick={props.onClick}
      >
        <use xlinkHref={`#${props.name}`}></use>
      </svg>
    </>
  );
};
