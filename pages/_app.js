/*
 * @Author: TingGe
 * @Date: 2021-01-15 10:35:31
 * @LastEditTime: 2024-04-09 11:22:03
 * @LastEditors: TingGe
 * @Description: 入口
 * @FilePath: /ting_ge_blog/pages/_app.js
 */

import App from 'next/app';
import React from 'react';
import _ from 'lodash';
import { Button, notification } from 'antd';
import { Provider } from 'react-redux';
import NProgress from 'nprogress';
import Router from 'next/router';
import theStore from 'store';
import Cookies from 'js-cookie';
import store from '@/store';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import { baseQueryList } from '@/public/utils/baseRequest';
import { ThemeProvider } from '@/components/Provider/themeToProvider';  
import { loadStyles, loadScript, isLogin, memorial, consoleLogLogo, clickTextAnime  } from '@/public/utils/utils';
import Layout from '@/components/Layout';
import { StarportCarrier } from '@react-starport/core';
// import config from '@/config';
import 'nprogress/nprogress.css';
import '../public/styles/global.css';


// 声明一个MyApp组件，然后这个组件用Provider进行包裹 react-redux。
export default class MyApp extends App {
  constructor (props) {
    super(props);
    this.state = {
      primaryColor: '#000000e0'
    };
  }
  
  static async getInitialProps(ctx) {
    const appProps = await App.getInitialProps(ctx);
    return { ...appProps }
  }

  refreshApp = () => {
    // this.setState({ primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()});
    this.forceUpdate()
  };

  componentDidMount () {
    // 主题
    window.refreshApp = this.refreshApp;

    // 判断Cookies是否有用户信息 有 存入redux
    if (Cookies.getJSON('userInfo') && Cookies.get('token')) {
      store.dispatch({
        type: 'changeUserInfo',
        payload: Cookies.getJSON('userInfo')
      });
    }
    // 公祭日置灰
    memorial();

    // 天气icon
    loadStyles('https://unpkg.com/qweather-icons@1.1.1/font/qweather-icons.css');

    // 多彩icon
    loadScript(
      '//at.alicdn.com/t/font_1114998_vq6vapu94g.js',
      () => {}
    );
    // SmoothScroll 丝滑滚动插件 别人家的cdn可能会失效
    loadScript(
      'https://cdn.bootcdn.net/ajax/libs/smoothscroll/1.4.9/SmoothScroll.min.js',
      () => {}
    );
    
    loadScript(
      'https://cdn.apple-livephotoskit.com/lpk/1/livephotoskit.js',
      () => {}
    );


    consoleLogLogo();
    // clickTextAnime();

    this.getNotification();

    // 轮询消息，一分钟查询一次
    setTimeout(() => {
      this.getMsg();

      setInterval(() => {
        this.getMsg();
      }, 60000);

    }, 2000);
  }

  // 消息推送
  getMsg = () => {
    if (isLogin()) {
      request(serviceApi.getMsg).then((res) => {
        // 存入react-redux
        store.dispatch({
          type: 'changeMsg',
          payload: res && res.data
        });
      });
    }
  };

  // 获取公告
  getNotification = () => {
    const storeNoticeArr = theStore.get('storeNoticeArr') || [];

    function openNotice (item) {
      notification.open({
        message: item.title,
        description: item.content,
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => notification.destroy(item.id)}
          >
            {item?.btnText}
          </Button>
        ),
        key: item?.id,
        type: 'info',
        duration: item?.duration * 1 || 0,
        onClick: () => {
          theStore.set('storeNoticeArr', [
            ...storeNoticeArr,
            { id: item.id }
          ]);
        }
      });
    }

    baseQueryList(serviceApi.getNoticeList, {
      filters: {
        endTime: new Date()
      },
      page: 1,
      limit: 20,
      orderBy: [
        ['id', 'desc']
      ]
    }).then((res) => {
      let noticeArr = [];
      noticeArr = res?.data?.list || [];
      if (!noticeArr) return;
      noticeArr.map((item, index) => {
        if (!_.isEmpty(_.filter(storeNoticeArr, { id: item.id }))) {
          return false;
        }

        // 不要一拥而上
        setTimeout(() => {
          openNotice(item);
        }, index * 800);
      });
    });
  };

  componentWillUnmount () {
    // 注销解绑事件
    // eslint-disable-next-line no-undef
    // document.documentElement.removeEventListener('click', fnTextPopup, false);
  }

  render () {
    const { Component, pageProps } = this.props;

    // 由于next路由特殊性，嵌套路由实现得曲折一点 参考 https://reacttricks.com/nested-dynamic-layouts-in-next-apps/
    // 管理员菜单
    const AdminLayout = Component.AdminLayout;

    // 传递刷新方法
    pageProps.refreshApp = this.refreshApp;

    const options = {
      duration: 700,
      easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
    }
    return (
      <Provider store={store}>
        <StarportCarrier {...options}>
          <ThemeProvider>
            {Component.noLayout ? (
                <Component {...pageProps} />
            ) : (
              <Layout refreshApp={this.refreshApp}>
                <>
                  {AdminLayout ? (
                      <AdminLayout>
                        <Component {...pageProps} />
                      </AdminLayout>
                  ) : (
                      <Component {...pageProps} />
                  )}
                </>
              </Layout>
            )}
          </ThemeProvider>
        </StarportCarrier>
      </Provider>
    );
  }
}

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});
