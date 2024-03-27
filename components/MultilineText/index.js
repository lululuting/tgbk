// 多行文本省略 组件
import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import  styles from './index.module.less';

/**
 * 通用单行/多行文本省略号 加tips
 */
const MultilineText = ({ className, rows, text, tooltip, ...props }) => {
  return (
    <div className={classNames(styles.multilineText, className)}>
      <Typography.Paragraph
        ellipsis={{
          rows
        }}
        {...props}
      >
        <Tooltip placement="top" title={tooltip ? text : null}>
          {text}
        </Tooltip>
      </Typography.Paragraph>
    </div>
  );
};
export default MultilineText;

MultilineText.propTypes = {

  /**
   * 样式名 可以自定义传入
   */
  className: PropTypes.string,

  /**
   * 行数
   */
  rows: PropTypes.number,

  /**
   * content文本内容
   */
  text: PropTypes.string.isRequired,

  /**
   * 是否需要 tooltip 提示
   */
  tooltip: PropTypes.bool
};

MultilineText.defaultProps = {
  className: 'multilineText',
  rows: 2,
  text: '',
  tooltip: false
};
