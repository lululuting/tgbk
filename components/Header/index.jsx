/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2024-04-11 13:19:58
 * @LastEditors: TingGe
 * @Description: 公用头部
 * @FilePath: /ting_ge_blog/components/Header/index.jsx
 */

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import _ from 'lodash';
import {
  Row,
  Col,
  Menu,
  Drawer,
  Input,
  Avatar,
  Badge,
  message,
  Dropdown,
  Tooltip,
  Popover
} from 'antd';
import request from '@/public/utils/request';
import {
  throttle,
  jsonp
} from '@/public/utils/utils';
import serviceApi from '@/config/service';
import config from '@/config';
// import TingggeFm from "../TingggeFm";
import theStore from 'store';
import SvgIcon from '@/components/SvgIcon';
import { dict } from '@/public/utils/dict';
import { useThemeContext } from '@/components/Provider/themeContext';
import {
  MenuOutlined,
  FlagTwoTone,
  MessageOutlined
} from '@ant-design/icons';
import Weather from './weather';
import Login from '../Login';
import WeatherIcon from './icon';
import styles from './style.module.less';

const themeOptions = {
  auto: { icon: 'iconhuihua', text: '跟随系统'},
  light: { icon: 'iconqingtian', text: '明亮'},
  dark: { icon: 'iconwanqingtian', text: '暗黑'}
};

const Header = (props) => {
  const [scrollActive, setScrollActive] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [ipWeather, setIpWeather] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isUp, setIsUp] = useState(false);
  const [ipLong, setIpLong] = useState(null);

  const { theme, toggleTheme } = useThemeContext();

  // 获取滚动条位置
  const getScrollTop = () => {
    let scrollTop = 0;
    if (process.browser) {
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
    }
    return scrollTop;
  };

  let scrollTop = 0; // 初始化滚动条为位置为0
  let topValue = 0; // 设置一个标识位，即复制一个滚动条位置，但是这个位置获取的时间比 scrollTop慢

  // 滚动顶部动画
  const scrollHandler = () => {
    let scrollTop = getScrollTop();

    if (document.querySelectorAll(`.${styles['homeHeader']}`)[0]) {
      if (scrollTop >= 100) {
        document
          .querySelectorAll(`.${styles['homeHeader']}`)[0]
          .setAttribute(
            'style',
            'top: -46px; position: fixed; transition: all .3s;'
          );
      } else {
        document
          .querySelectorAll(`.${styles['homeHeader']}`)[0]
          .setAttribute('style', 'top: -46px; position: fixed;');

        if (scrollTop >= 46) {
          document
            .querySelectorAll(`.${styles['homeHeader']}`)[0]
            .setAttribute('style', 'top: -46px; position: fixed;');
        } else {
          document
            .querySelectorAll(`.${styles['homeHeader']}`)[0]
            .setAttribute('style', 'top: 0px; position: absolute;');
        }
      }

      if (scrollTop >= 200) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }
    }
  };

  // 滚动标题事件
  const scrollTitleFn = () => {
    scrollTop = getScrollTop(); // 滚动条的位置
    if (scrollTop <= topValue) {
      setIsUp(false);
    } else {
      setIsUp(true);
    }
    setTimeout(function () {
      topValue = scrollTop;
    }, 0);
  };

  // 滚动标题节流绑定
  const scrollTitle = throttle(scrollTitleFn, 500);

  // 点击改变
  const selectChang = (key) => {
    Router.push('/list/[type]', `/list/${key}`);
  };

  // 回车事件
  const onPressEnterLink = () => {
    Router.push(
      '/search/[...search]',
      `/search/${_.get(dict, 'searchType.article')}/${searchVal}`
    );
  };

  // 渲染两种icon
  const renderIcon = (str) => {
    if (!scrollActive && isHome) {
      return str + '_s';
    }
    return str;
  };

  useEffect(() => {

    if (location.pathname === '/index' || location.pathname === '/') {
      scrollHandler();
      setIsHome(true);
      window.addEventListener('scroll', scrollHandler, false);
    }

    if (location.pathname === '/detail') {
      setIsHome(false);
      window.addEventListener('scroll', scrollTitle, false);
    }

    if (props.router.query.searchVal) {
      setSearchVal(props.router.query.searchVal);
    }

    // 微博登陆重定向后，获取微博的code 再去后台请求微博的接口进行登陆
    if (props.router.query.code) {
      request(serviceApi.getWeiboUserInfo, {
        method: 'get',
        params: {
          code: props.router.query.code
        }
      }).then((res) => {
        if (res && res.code == 200) {
          // 记录cookies创建时间 后面有更新cookie但不改过期时间的需求
          let createAt = new Date(new Date().getTime() + 60 * 60 * 1000 * 24);
          res.data.cookiesCreateAt = createAt;

          Cookies.set('userInfo', res.data, {
            expires: createAt
          });

          message.success('登录成功！');
          // 存入react-redux
          props.userInfoChange(res.data);
          // 清掉路由信息
          Router.replace('/');
        }
      });
    }

    // ip定位
    jsonp({
      url: serviceApi.ipWeather,
      data: {
        ak: config.map.ak,
        coor: config.map.coor
      },
      success: (res) => {
        setIpWeather(res.content);
        setIpLong({ adlng: res.content.point.x, adlat: res.content.point.y });

        request(serviceApi.weather, {
          method: 'get',
          params: {
            location: `${res.content.point.x},${res.content.point.y}`,
            lang: 'cn'
          }
        }).then((ress) => {
          setWeatherInfo(ress?.data);
        });
      }
    });
  }, []);

  useEffect(() => {
    // 监听路由做动画的，乱，我也不知道我在写什么～
    Router.events.on('routeChangeComplete', () => {
      if (location.pathname === '/index' || location.pathname == '/') {
        setIsHome(true);
        scrollHandler();
        window.addEventListener('scroll', scrollHandler, false);
      } else {
        setIsHome(false);
        setScrollActive(false);
        window.removeEventListener('scroll', scrollHandler, false);

        if (document.querySelectorAll(`.${styles['header']}`)[0]) {
          document.querySelectorAll(`.${styles['header']}`)[0].setAttribute('style', 'top: 0; position: fixed;');
        }
      }

      if (location.pathname === '/detail') {
        window.addEventListener('scroll', scrollTitle, false);
      } else {
        setIsUp(false);
        window.removeEventListener('scroll', scrollTitle, false);
      }
    });
  }, []);

  const { userInfo, msgData } = props;
  const showLogin = () => {
    Login.show();
  };

  // 创作
  const writeArticle = () => {
    if (
      -1 !==
      _.indexOf(
        [_.get(dict, 'auth.blogger'), _.get(dict, 'auth.super')],
        props.userInfo.auth * 1
      )
    ) {
      window.open('/articleAdd');
    } else {
      message.warning('抱歉，创作的权限暂仅对内部博主开放！');
    }
  };

  // 退出登录
  const logout = () => {
    request(serviceApi.logOut, {
      method: 'get'
    }).then((res) => {
      if (res && res.code == 200) {
        props.userInfoChange(null);
        Cookies.remove('userInfo');
        message.success('退出成功！');

        // 清掉路由信息
        Router.replace('/');
      }
    });
  };

  const linkUser = (id) => {
    window.open(`/userCenter/${id}`);
  };

  //  渲染按钮 自定义传入
  const renderAction = () => {
    if (props.renderAction) {
      return props.renderAction();
    }
    // 固定逻辑
    return userInfo && userInfo.userId ? (
      <div key="1" className={styles['writing']} onClick={writeArticle}>
        <SvgIcon name="iconchuangzuo_s" />
        创作
      </div>
    ) : (
      <div key="2" className={styles['writing']} onClick={showLogin}>
        <SvgIcon name="icondaifahuo1" />
        登录
      </div>
    );
  };

  // 主题切换
  const switchTheme = () => {
    toggleTheme && toggleTheme()
    props.refreshApp();
  };

  // 主题icon的切换
  const returnTheme = (ish5) => {
    if (ish5) {return 'iconhuihua';}
    return renderIcon(themeOptions[theme].icon);
  };


  return (
    <div
      className={classNames({
        [styles['header']]: true,
        [styles['homeHeader']]: isHome,
        [styles['scrollActive']]: scrollActive,
        [styles['isUp']]: isUp
      })}
    >
      {/* 详情页标题 */}
      {props?.currentArticleInfo?.id && props.router.pathname === '/detail' ? (
        <Row
          className={classNames('wrap', styles['header-box '], styles['detail'])}
          type="flex"
          align="middle"
          justify="space-between"
        >
          <Row className={styles['action-box']}>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div className="detail-title">
                <FlagTwoTone style={{ marginRight: 20 }} />
                {props.currentArticleInfo.title}
              </div>
            </Col>

            <Col xs={0} sm={0} md={0} lg={7} xl={7}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <Link
                  href="/userCenter/[id]"
                  as={`/userCenter/${props.currentArticleInfo.userId}`}
                >
                  <a
                    className="ellipsis"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Avatar
                      shape="square"
                      size={28}
                      src={props.currentArticleInfo.avatar}
                      style={{ marginRight: 5 }}
                    />
                    <span
                      className="ellipsis"
                      style={{ color: '#666', fontSize: 12, maxWidth: 100 }}
                    >
                      {props.currentArticleInfo.userName}
                    </span>
                  </a>
                </Link>

                {/* 锚点 */}
                <a href="#comment-box">
                  <div className={styles['dit-comment']}>
                    <MessageOutlined
                      style={{ fontSize: 16, marginRight: 10 }}
                    />
                    评论
                  </div>
                </a>
              </div>
            </Col>
          </Row>
        </Row>
      ) : null}

      <Row
        className={classNames('wrap', styles['header-box'], styles['common'])}
        align="middle"
        justify="space-between"
      >
        <Col className={styles['left-logo']} xs={10} sm={10} md={4} lg={4}>
          <Link href="/">
            <a className={styles['logo']}></a>
          </Link>
          <span className={styles['logo-text']}>冲浪记录站</span>
        </Col>

        <Col className={styles['right-menu']} xs={0} sm={0} md={20} lg={20}>
          {ipWeather ? (
            <Popover
              placement="bottom"
              overlayClassName={styles['weather-box']}
              content={
                <Weather
                  weatherInfo={weatherInfo}
                  ipWeather={ipWeather}
                  ipLong={ipLong}
                />
              }
              trigger="hover"
            >
              <div className={styles['weather-title-box']}>
                <span>{ipWeather.address_detail.city}</span>
                {_.get(weatherInfo, 'now') ? (
                  <>
                    <SvgIcon
                      name={renderIcon('icontianqi')}
                      style={{
                        cursor: 'pointer',
                        fontSize: 24,
                        margin: '0 5px'
                      }}
                    />
                    <span>{weatherInfo.now.temp}℃</span>
                  </>
                ) : null}
              </div>
            </Popover>
          ) : null}

          <Input
            className={classNames(styles['search-input'], styles['search-pc'])}
            placeholder="请开始你的表演"
            value={searchVal}
            onPressEnter={onPressEnterLink}
            onChange={(e) => setSearchVal(e.target.value)}
            suffix={
              <div className={styles['search-btn']}>
                <SvgIcon
                  name={renderIcon('iconsousuo')}
                  style={{ cursor: 'pointer' }}
                  onClick={onPressEnterLink}
                />
              </div>

            }
          />

          <Tooltip
            placement="bottom"
            title={
              '主题模式：' + themeOptions[theme].text
            }
          >
            <SvgIcon
              name={themeOptions[theme].icon}
              addClass="theme-icon"
              style={{ cursor: 'pointer' }}
              onClick={switchTheme}
            />
          </Tooltip>

          {/* Tingge-FM */}
          {/* <Popover placement="bottom" content={(
            <TingggeFm />
          )} trigger="hover">
            <IconFont
              type="iconshushuye"
              style={{ fontSize: 24, margin: '0 5px 0 10px', cursor: 'pointer' }}
            />
          </Popover> */}

          {userInfo?.userId ? (
            <div className={styles['user-box']}>
              {/* 已登录	 */}
              <Popover
                placement="bottom"
                overlayClassName={styles['header-user-box']}
                content={
                  <div className={styles['header-user-info']}>
                    <div className={styles['user-avatar-box']}>
                      <Avatar className={styles['user-avatar']} src={userInfo.avatar} />
                    </div>

                    <p className={styles['user-name']}>{userInfo.userName}</p>

                    <div className={styles['info-box']}>
                      <div className={styles['item']}>
                        <p className={styles['title']}>文章</p>
                        {userInfo.aNum}
                      </div>

                      <div className={styles['item']}>
                        <p className={styles['title']}>粉丝</p>
                        {userInfo.fNum}
                      </div>

                      <div className={styles['item']}>
                        <p className={styles['title']}>获赞</p>
                        {userInfo.cNum}
                      </div>
                    </div>

                    <ul className={styles['user-options']}>
                      <li onClick={() => linkUser(userInfo.userId)}>
                        <SvgIcon name="icongerenziliao1" />个人中心
                      </li>

                      <li
                        className={styles['user-msg']}
                        onClick={() => Router.push('/msgCenter')}
                      >
                        <SvgIcon name="icontonggao" />我的信息
                        <span className={styles['msg-num']}>
                          <Badge
                            count={msgData && msgData.length}
                            style={{
                              backgroundColor: 'rgba(245,34,45,.2)',
                              color: 'red',
                              boxShadow: 'none'
                            }}
                          />
                        </span>
                      </li>
                      {
                        props.userInfo.auth * 1 === _.get(dict, 'auth.super')
                          ? <li onClick={() => window.open('/admin')}>
                            <SvgIcon name="iconxitongshezhi" />管理后台
                          </li> : null
                      }
                      <li onClick={logout}>
                        <SvgIcon name="iconshouhou" />退出
                      </li>
                    </ul>
                  </div>
                }
              >
                <Badge dot={!!(msgData && msgData.length)}>
                  <Avatar className={styles['user-avatar']} src={userInfo.avatar} />
                </Badge>
              </Popover>
            </div>
          ) : null}

          <div className={styles['menu-box']}>
            <a
              className={styles['item']}
              onClick={() => selectChang(_.get(dict, 'articleType.skill'))}
            >
              <SvgIcon name={renderIcon('iconjiaoxue')} />
              技术
            </a>
            <a
              className={styles['item']}
              onClick={() =>
                selectChang(_.get(dict, 'articleType.photography'))
              }
            >
              <SvgIcon name={renderIcon('iconpaizhao')} />
              摄影
            </a>
            <a
              className={styles['item']}
              onClick={() => selectChang(_.get(dict, 'articleType.life'))}
            >
              <SvgIcon name={renderIcon('iconyinliao')} />
              生活
            </a>
          </div>

          {renderAction()}
        </Col>

        {/* 移动端 menu */}
        <div className={styles['xs-menu']} id="xs-menu">
          {userInfo?.userId ? (
            <Dropdown
              // getPopupContainer={() => document.getElementById('xs-menu')}
              placement="bottomRight"
              trigger={['click']}
              overlayStyle={{ width: '100%', left: 0 }}
              overlay={
                <ul className={styles['xs-menu-user-options']}>
                  <li onClick={() => linkUser(userInfo.userId)}>
                    <SvgIcon name="icongerenziliao1" /> 个人中心
                  </li>

                  <li
                    className={styles['user-msg']}
                    onClick={() => Router.push('/msgCenter')}
                  >
                    <SvgIcon name="icontonggao" /> 我的信息
                    <span className={styles['msg-num']}>
                      <Badge
                        count={msgData && msgData.length}
                        style={{
                          backgroundColor: 'rgba(245,34,45,.2)',
                          color: 'red',
                          boxShadow: 'none'
                        }}
                      />
                    </span>
                  </li>

                  {
                    props.userInfo.auth * 1 === _.get(dict, 'auth.super')
                      ? <li onClick={() => window.open('/admin')}>
                        <SvgIcon name="iconxitongshezhi" /> 管理后台
                      </li> : null
                  }

                  <li onClick={logout}>
                    <SvgIcon name="iconshouhou" />  退出
                  </li>
                </ul>
              }
            >
              <Badge dot={!!(msgData && msgData.length)}>
                <Avatar
                  className={styles['user-avatar']}
                  src={userInfo && userInfo.avatar}
                />
              </Badge>
            </Dropdown>
          ) : null}

          {userInfo?.userId ? null : (
            <div key="2" className={styles['writing']} onClick={showLogin}>
              <SvgIcon style={{ marginRight: 10 }} name={'icondaifahuo'} />
              登录
            </div>
          )}

          <MenuOutlined
            style={{ fontSize: 20, marginLeft: 20 }}
            type="menu"
            onClick={() => setMenuVisible(true)}
          />
        </div>

        {/* 目录 */}
        <Drawer
          title={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              挺哥博客
              <SvgIcon name={returnTheme(true)} style={{ fontSize: 24, marginRight: 10 }} onClick={switchTheme} />
            </div>
          }
          placement="right"
          closable={false}
          onClose={() => setMenuVisible(false)}
          open={menuVisible}
          bodyStyle={{ padding: 0 }}
        >
          {ipWeather ? (
            <div id="m-weathe-box">
              <span>{ipWeather.address_detail.city}</span>
              {weatherInfo?.now ? (
                <>
                  <WeatherIcon
                    code={weatherInfo?.now?.icon}
                    size={18}
                    style={{ margin: '0 5px' }}
                  />
                  <span>{weatherInfo.now.temp}℃</span>
                </>
              ) : null}
            </div>
          ) : null}

          <Input
            style={{ margin: '24px auto' }}
            className={classNames(styles['search-input'], styles['search-h5'])}
            placeholder="请开始你的表演"
            value={searchVal}
            onPressEnter={onPressEnterLink}
            onChange={(e) => setSearchVal(e.target.value)}
            suffix={
              <SvgIcon
                name="iconsousuo"
                style={{ cursor: 'pointer' }}
                onClick={onPressEnterLink}
              />
            }
          />

          <Menu
            mode="vertical"
            style={{ border: 'none' }}
            onClick={() => setMenuVisible(false)}
          >
            <Menu.Item key={_.get(dict, 'articleType.skill')}>
              <Link
                href="/list/[type]"
                as={`/list/${_.get(dict, 'articleType.skill')}`}
              >
                <a>
                  <SvgIcon name="iconjiaoxue" />

                  技术
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key={_.get(dict, 'articleType.photography')}>
              <Link
                href="/list/[type]"
                as={`/list/${_.get(dict, 'articleType.photography')}`}
              >
                <a>
                  <SvgIcon name="iconpaizhao" />

                  摄影
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key={_.get(dict, 'articleType.life')}>
              <Link
                href="/list/[type]"
                as={`/list/${_.get(dict, 'articleType.life')}`}
              >
                <a>
                  <SvgIcon name="iconyinliao" />
                  生活
                </a>
              </Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </Row>
    </div>
  );
};

const stateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    msgData: state.msgData,
    loginLoading: state.loginLoading,
    currentArticleInfo: state.currentArticleInfo
  };
};

const dispatchToProps = (dispatch) => {
  return {
    userInfoChange (obj) {
      let action = {
        type: 'changeUserInfo',
        payload: obj
      };

      dispatch(action);
    }
  };
};

export default withRouter(connect(stateToProps, dispatchToProps)(Header));
