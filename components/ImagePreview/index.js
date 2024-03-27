import React from 'react';
import _ from 'lodash';
import { Image } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.module.less';

/**
 * 图片预览组件
 */
const ImagePreview = ({ className, dataSource, options }) => {
  return (
    <div className={`${styles.box} ${className ? className : ''}`} >
      <Image.PreviewGroup>
        {_.map(dataSource, (item, index) => (
          <div className={styles.image} key={index} >
            <Image src={item} alt="图片" {...options} />
          </div>
        ))}
      </Image.PreviewGroup>
    </div>
  );
};

ImagePreview.propTypes = {

  /**  自定义外层 className */
  className: PropTypes.string,

  /**  数据源 className */
  dataSource: PropTypes.array,

  /** image参数配置，与 antd Image组件 一致 */
  options: PropTypes.object
};

ImagePreview.defaultProps = {
  className: '',
  dataSource: [],
  options: {
    width: 100,
    height: 100
  }
};

export default ImagePreview;

