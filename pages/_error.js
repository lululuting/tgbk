/*
 * @Author: TingGe
 * @Date: 2021-01-15 10:35:31
 * @LastEditTime: 2022-11-02 14:10:08
 * @LastEditors: TingGe
 * @Description: 自定义错误页
 * @FilePath: /ting_ge_blog/pages/_error.js
 */

import React from 'react';
import '@/public/styles/error.less';

export default class Error extends React.Component {
  static getInitialProps ({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render () {
    return (
      <div className="container">
        {this.props.statusCode == 404 ? (
          <div className="page_404">
            <h1 className="text-center">{this.props.statusCode}</h1>
            <div className="four_zero_four_bg"></div>
            <div className="contant_box_404">
              <h3 className="h2">别问！问就是 404</h3>
              <p>返回首页或者刷新页面还可以抢救一下</p>
              <a href="/" className="link_home">
                返回首页
              </a>
            </div>
          </div>
        ) : (
          <div className="boo-wrapper">
            <h1>{this.props.statusCode}</h1>
            <div className="boo">
              <div className="face"></div>
            </div>
            <div className="shadow"></div>
            <p>为什么为什么就突然间崩了呢？？？</p>
            <a href="/" className="link_home">
              返回首页
            </a>
          </div>
        )}
      </div>
    );
  }
}
