/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-02-09 21:46:59
 * @LastEditors: TingGe
 * @Description: layout 公共布局
 * @FilePath: /ting_ge_blog/components/Layout/index.jsx
 */

import React from 'react';
import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import Sider from '../Side';
// import dynamic from 'next/dynamic';
// const Aplayer = dynamic(import('../Aplayer'), { ssr: false })
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './style.module.less';

const Layout = (props) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </Head>

      <div className={styles.box}>
        {
          props.renderHeader ? <Header {...props.headerProps} refreshApp={props.refreshApp}/> : null
        }
        <div className={classNames('wrap', styles.content)}>
          {
            props.children
          }
          {
            props.renderSide ? <Sider /> : null
          }
          {/* <Aplayer id={props.userInfo && props.userInfo.songsId ? props.userInfo.songsId : 705619441} /> */}
        </div>
        {
          props.renderFooter ? <Footer /> : null
        }
      </div>
    </>
  );
};

Layout.propTypes = {

  /**  是否渲染头部 */
  renderHeader: PropTypes.bool,

  /**  头部props */
  headerProps: PropTypes.object,

  /**  是否渲染尾部 */
  renderFooter: PropTypes.bool,

  /**  是否渲染侧部 */
  renderSide: PropTypes.bool
};

Layout.defaultProps = {
  renderHeader: true,
  headerProps: {},
  renderFooter: true,
  renderSide: true
};

export default connect(({ userInfo }) => ({
  userInfo
}))(Layout);
