/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-06-24 20:44:00
 * @LastEditors: TingGe
 * @Description: 公用头部
 * @FilePath: /tgbk/components/Header/index.jsx
 */

import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Row, Col, Menu, Drawer, Spin, Input, Avatar, Badge, message, Dropdown, Tooltip, Popover } from 'antd'
import request from '@/public/utils/request'
import { throttle, loadScript, loadStyles, removeStyles, jsonp } from '@/public/utils/utils'

import serviceApi from '@/config/service'
import Login from '../Login'
import TingggeFm from '../TingggeFm'
import theStore from 'store'
import moment from 'moment'
import IconFont from '@/components/IconFont'
import {
  ExperimentOutlined,
  CameraOutlined,
  CoffeeOutlined,
  DesktopOutlined,
  MobileOutlined,
  MenuOutlined,
  WarningOutlined,
  FlagTwoTone,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  PoweroffOutlined,
  HighlightOutlined
} from '@ant-design/icons'
import './style.less'

const { Search } = Input
const darkPath = '//cdn.lululuting.com/tgbk_static/dark.css';

const Header = (props) => {

  const [scrollActive, setScrollActive] = useState(false)
  const [isHome, setIsHome] = useState(false)
  const [muneVisible, setMuneVisible] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [ipWeather, setIpWeather] = useState(null)
  const [weatherInfo, setWeatherInfo] = useState(null)
  const [isUp, setIsUp] = useState(false)
  const [ipLong, setIpLong] = useState(null)
  const [theme, setTheme] = useState(0)

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
  }

  let scrollTop = 0; // 初始化滚动条为位置为0
  let topValue = 0; // 设置一个标识位，即复制一个滚动条位置，但是这个位置获取的时间比 scrollTop慢

  // 滚动顶部动画
  const scrollHandler = () => {
    let scrollTop = getScrollTop()

    if (document.querySelectorAll('.homeHeader')[0]) {
      if (scrollTop >= 100) {
        document.querySelectorAll('.homeHeader')[0].setAttribute('style', 'top: -46px; position: fixed; transition: all .3s;')
      } else {
        document.querySelectorAll('.homeHeader')[0].setAttribute('style', 'top: -46px; position: fixed;')

        if (scrollTop >= 46) {
          document.querySelectorAll('.homeHeader')[0].setAttribute('style', 'top: -46px; position: fixed;')
        } else {
          document.querySelectorAll('.homeHeader')[0].setAttribute('style', 'top: 0px; position: absolute;')
        }
      }

      if (scrollTop >= 200) {
        setScrollActive(true)
      } else {
        setScrollActive(false)
      }
    }
  }

  // 滚动标题事件
  const scrollTitleFn = () => {
    scrollTop = getScrollTop(); // 滚动条的位置
    if (scrollTop <= topValue) {
      setIsUp(false)
    } else {
      setIsUp(true)
    }
    setTimeout(function () {
      topValue = scrollTop;
    }, 0);
  }
  // 滚动标题节流绑定
  const scrollTitle = throttle(scrollTitleFn, 500);

  // 点击改变
  const selectChang = (key) => {
    Router.push('/list/[type]', `/list/${key}`)
  }

  // 回车事件
  const onPressEnterLink = () => {
    Router.push('/search/[...search]', `/search/article/${searchVal}`)
  }

  useEffect(() => {

    // 改用本地css进行快速暗黑模式适配 无需再请求接口动态分析， 问题：如果后面新增的页面无法适配，请用 DarkReader.exportGeneratedCSS(); 重新导出css重写dark.css
    // 插件链接 https://github.com/darkreader/darkreader
    if (~~theStore.get('themeType')) {
      setTheme(~~theStore.get('themeType'))
    } else {
      setTheme(1)
    }

    if (location.pathname === '/index' || location.pathname === '/') {
      scrollHandler();
      setIsHome(true)
      window.addEventListener('scroll', scrollHandler, false);
    }

    if (location.pathname === '/detail') {
      window.addEventListener('scroll', scrollTitle, false);
    }

    if (props.router.query.searchVal) {
      setSearchVal(props.router.query.searchVal)
    }

    // 判断localStorage是否有用户信息 有 存入redux
    if (theStore.get('userInfo') && theStore.get('userInfo').token) {
      // 存入react-redux
      props.userInfoChange(theStore.get('userInfo'))
    }

    if (props.router.query.code) {
      request(serviceApi.getWeiboUserInfo, {
        method: 'get',
        params: {
          code: props.router.query.code,
        }
      }).then((res) => {
        if (res && res.code == 200) {
          theStore.set("userInfo", res.data);
          message.success('登录成功！')
          // 存入react-redux
          props.userInfoChange(res.data)
          // 清掉路由信息
          Router.replace('/')
        }
      })
    }

    jsonp({
      url: serviceApi.ipWeather,
      data: {
        ak: '', // 百度地图ak
        coor: 'gcj02'
      },
      success: (res) =>{ 
        setIpWeather(res.content)
        setIpLong({ adlng: res.content.point.x, adlat: res.content.point.y })
  
        request(serviceApi.weather, {
          method: 'get',
          params: {
            location: `${res.content.point.x},${res.content.point.y}`,
            lang: "cn",
          }
        }).then((ress) => {
          setWeatherInfo(ress.data)
        })
      }
    })

    // 丝滑滚动插件
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js', () => { });
  }, [])

  useEffect(() => {
    // 监听路由做动画的，乱，我也不知道我在写什么～
    Router.events.on('routeChangeComplete', (...args) => {

      if (location.pathname === '/index' || location.pathname == '/') {
        setIsHome(true)
        scrollHandler();
        window.addEventListener('scroll', scrollHandler, false);
      } else {
        setIsHome(false)
        setScrollActive(false)
        window.removeEventListener('scroll', scrollHandler, false)

        if (document.querySelectorAll('.header')[0]) {
          document.querySelectorAll('.header')[0].setAttribute('style', 'top: 0; position: fixed;')
        }
      }

      if (location.pathname === '/detail') {
        window.addEventListener('scroll', scrollTitle, false);
      } else {
        setIsUp(false)
        window.removeEventListener('scroll', scrollTitle, false)
      }
    })

    // 监听系统模式切换
    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      if (e.matches) {
        // 系统开启暗色模式后做什么
        loadStyles(darkPath)
      } else {
        // 系统关闭暗色模式后做什么
        removeStyles(darkPath)
      }
    });
  }, [])

  const { userInfo, msgData } = props;
  const showLogin = () => {
    Login.show()
  }

  // 创作
  const writeArticle = () => {
    if (~~props.userInfo.auth > 0) {
      window.open('http://admin.lululuting.com')
    } else {
      message.warning('抱歉,创作的权限暂仅对内部博主开放！')
    }
  }

  // 退出登录
  const logout = () => {
    props.userInfoChange(null);
    localStorage.setItem("userInfo", null);
    message.success('退出成功！')

    // 清掉路由信息
    Router.replace('/')
  }

  const linkUser = (id) => {
    window.open(`/userCenter/${id}`)
  }

  // 天气
  const weatherContent = (
    <div id="weather-content">
      <If condition={weatherInfo && weatherInfo.now}>
        <div className="info1">
          <div className="left">
            <div className="temp">
              {weatherInfo.now.temp}
              <span style={{ fontSize: 16, fontWeight: 300, color: '#999' }}>℃</span>
            </div>
            <div className="address">
              {ipWeather.address_detail.city}
              <div className="temp-text">
                {weatherInfo.daily[0].tempMin}
                <span style={{ fontSize: 12, fontWeight: 300, color: '#999', marginTop: 2 }}>℃</span>
                <span style={{ margin: '0 5px' }}>-</span>
                {weatherInfo.daily[0].tempMax}
                <span style={{ fontSize: 12, fontWeight: 300, color: '#999', marginTop: 2 }}>℃</span>
              </div>

            </div>
            <p className="trend">{weatherInfo.summary}</p>
          </div>

          <div className="right">
            <img src={`//cdn.lululuting.com/weather/${weatherInfo.now.icon} .png`} />
          </div>
        </div>

        {/* 只取第一条最新的警告  */}
        <If condition={weatherInfo.warning[0]}>
          <div className="warning-box">
            <WarningOutlined type="warning" style={{ marginRight: 10, color: '#ff4d4f', fontSize: 18 }} />
            <div className="warning">{weatherInfo.warning[0].text}</div>
          </div>
        </If>

        <div className="info2">
          <div className="option">
            <div className="item">
              <p className="tit">日出日落</p>
              <p className="con">
                {moment(weatherInfo.sunmoon.sunrise).format('HH:mm')} -
                {moment(weatherInfo.sunmoon.sunset).format('HH:mm')}
              </p>
            </div>
            <div className="item">
              <p className="tit">湿度</p>
              <p className="con">{weatherInfo.now.humidity}%</p>
            </div>
          </div>
          <div className="option">
            <div className="item">
              <p className="tit">风速</p>
              <p className="con">{weatherInfo.now.windDir} {weatherInfo.now.windScale}级</p>
            </div>
            <div className="item">
              <p className="tit">气压</p>
              <p className="con">{weatherInfo.now.pressure}hpa</p>
            </div>
          </div>
        </div>

        {/* 天气实况图 */}
        <If condition={ipLong}>
          <iframe width="400" height="150" src={`https://embed.windy.com/embed2.html?lat=${ipLong.adlat}&lon=${ipLong.adlng}&detailLat=34.069&detailLon=-118.323&width=380&height=200&zoom=10&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`} frameBorder="0"></iframe>
        </If>

        <div className="info3">
          <div className="future">
            <div className="title">未来7小时</div>
            <ul className="list">
              <For each="item" index="index" of={weatherInfo.hourly.slice(0, 7)}>
                <li className="item" key={index}>
                  <img src={`//cdn.lululuting.com/weather2/${item.icon} .png`} />
                  <div className="temp">{item.temp}</div>
                  <div className="time">{moment(item.fxTime).format('HH')}时</div>
                </li>
              </For>
            </ul>
          </div>

          <div className="future">
            <div className="title">未来7天</div>
            <ul className="list">
              <For each="item" index="index" of={weatherInfo.daily}>
                <li className="item" key={index}>
                  <img src={`//cdn.lululuting.com/weather2/${item.iconDay} .png`} />
                  <div className="temp">{item.tempMax}</div>
                  <div className="time">{moment(item.fxDate).format('dddd')}</div>
                </li>
              </For>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: 12, textAlign: 'center', color: '#999', margin: '20px 0 10px' }}>
          挺哥预报 & 和风天气 - 实况天气推送： {moment(weatherInfo.updateTime).startOf('min').fromNow()}
        </p>
      </If>

      <If condition={!weatherInfo || !weatherInfo.now}>
        <Spin tip="祈祷中..." />
      </If>
    </div>
  )

  // 主题切换
  const switchTheme = () => {
    if (theme == 3) {
      setTheme(1)
      theStore.set('themeType', 1)
    } else {
      setTheme(theme + 1)
      theStore.set('themeType', theme + 1)
    }
  }

  // 主题切换
  const returnTheme = () => {
    let str = 'iconai249'

    if (theme == 2) {
      str = 'iconbaitianmoshimingliangmoshi'
    }
    if (theme == 3) {
      str = 'iconyejianmoshi'
    }
    return str
  }

  useEffect(() => {
    switch (theme) {
      case 1:
        const darkScheme = matchMedia('(prefers-color-scheme: dark)');
        if (darkScheme.matches) {
          loadStyles(darkPath)
        } else {
          removeStyles(darkPath)
        }
        break;
      case 2:
        removeStyles(darkPath)
        break;
      case 3:
        loadStyles(darkPath)
        break;
    }
  }, [theme])

  return (
    <div className={classnames({ 'header': true, 'homeHeader': isHome, 'scrollActive': scrollActive, 'isUp': isUp })}>

      {/* 详情页标题 */}
      <If condition={props.currentArticleInfo && props.currentArticleInfo.id && props.router.pathname === '/detail'}>
        <Row className={classnames('wrap header-box detail')} type="flex" align="middle" justify="space-between">
          <Row className="action-box">
            {/* <Col lg={1} xl={1}></Col> */}

            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div className="detail-title">
                <FlagTwoTone style={{ marginRight: 20 }} />
                {props.currentArticleInfo.title}
              </div>
            </Col>

            <Col xs={0} sm={0} md={0} lg={7} xl={7}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Link href='/userCenter/[id]' as={`/userCenter/${props.currentArticleInfo.userId}`}>
                  <a className="ellipsis" style={{ display: 'flex', alignItems: 'center', }}>
                    <Avatar shape="square" size={28} src={props.currentArticleInfo.avatar} style={{ marginRight: 5 }} />
                    <span className="ellipsis" style={{ color: '#666', fontSize: 12, maxWidth: 100 }}>{props.currentArticleInfo.userName}</span>
                  </a>
                </Link>

                {/* 锚点 */}
                <a href='#comment-box'>
                  <div className="edit-comment" >
                    <MessageOutlined style={{ fontSize: 16, marginRight: 10 }} />
                      评论
                    </div>
                </a>
              </div>
            </Col>

          </Row>
        </Row>
      </If>

      <Row className={classnames('wrap header-box common')} type="flex" align="middle" justify="space-between">
        <Col className="left-logo" xs={24} sm={24} md={4} lg={4}>
          <Link href="/">
            <a className="logo"></a>
          </Link>
          <span className="logo-text">冲浪记录站</span>
        </Col>

        <Col className="right-memu" xs={0} sm={0} md={20} lg={20}>
          <If condition={ipWeather}>
            <Popover placement="bottom" content={weatherContent} trigger="hover">
              <div className='weather-title-box'>
                <span>{ipWeather.address_detail.city}</span>
                <If condition={weatherInfo && weatherInfo.now}>
                  <img style={{ width: 20, height: 20, marginRight: 5 }} src={`//cdn.lululuting.com/weather/${weatherInfo.now.icon} .png`} />
                  <span>{weatherInfo.now.text}</span>
                  <span>{weatherInfo.now.temp}℃</span>
                  {/* <span>{weatherInfo.now.windDir}{weatherInfo.now.windScale}级</span> */}
                </If>
              </div>
            </Popover>
          </If>

          <Search
            className={classnames('search-input search-pc')}
            placeholder="请开始你的表演"
            value={searchVal}
            enterButton
            onChange={(e) => setSearchVal(e.target.value)}
            onSearch={onPressEnterLink}
          />

          <Tooltip placement="bottom" title={'主题模式：' + ({ 1: '跟随系统', 2: '明亮', 3: '暗黑' })[theme]}>
            <IconFont
              type={returnTheme()}
              style={{ fontSize: 24, margin: '0 5px 0 0px' }}
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

          <If condition={userInfo && userInfo.userId}>
            <div className="user-box">
              {/* 已登录	 */}

              <Popover placement="bottom" overlayClassName="header-user-box" content={(
                <div id="header-user-info">
                  <div className="user-avatar-box">
                    <Avatar className="user-avatar" src={userInfo.avatar} />
                  </div>

                  <p className="user-name">{userInfo.userName}</p>

                  <div className="info-box">
                    <div className="item">
                      <p className="title">文章</p>
                      {userInfo.aNum}
                    </div>

                    <div className="item">
                      <p className="title">粉丝</p>
                      {userInfo.fNum}
                    </div>

                    <div className="item">
                      <p className="title">获赞</p>
                      {userInfo.cNum}
                    </div>

                  </div>

                  <ul className="user-options">
                    <li onClick={() => linkUser(userInfo.userId)}>
                      <UserOutlined /> 个人中心
                  </li>

                    <li className="user-msg" onClick={() => Router.push(`/msgCenter`)} >
                      <BellOutlined /> 我的信息

                    <span className="msg-num">
                        <Badge
                          count={msgData && msgData.length}
                          style={{ backgroundColor: 'rgba(245,34,45,.2)', color: 'red', boxShadow: 'none' }}
                        />
                      </span>
                    </li>

                    <li onClick={logout}>
                      <PoweroffOutlined /> 退出
                  </li>
                  </ul>

                </div>
              )} >
                <Badge dot={msgData && msgData.length ? true : false}>
                  <Avatar className="user-avatar" src={userInfo.avatar} />
                </Badge>
              </Popover>
            </div>
          </If>

          <div className="menu-box">
            <a className="item" onClick={() => selectChang(1)}>
              <ExperimentOutlined />
									技术
								</a>
            <a className="item" onClick={() => selectChang(2)}>
              <CameraOutlined />
								摄影
								</a>
            <a className="item" onClick={() => selectChang(3)}>
              <CoffeeOutlined />
								生活
								</a>
          </div>

          {
            userInfo && userInfo.userId ?
              <div key="1" className="writing" onClick={writeArticle}>
                <HighlightOutlined style={{ fontSize: 16, marginRight: 10 }} />
							创作
						</div>
              :
              <div key="2" className="writing" onClick={showLogin}>
                <DesktopOutlined style={{ marginRight: 10 }} />
							登录
						</div>
          }

        </Col>

        {/* 移动端 menu */}
        <div className="xs-menu" id="xs-menu">
          <If condition={userInfo && userInfo.userId}>
            <Dropdown
              getPopupContainer={() => document.getElementById('xs-menu')}
              placement="bottomRight"
              trigger={['click']}
              overlayStyle={{ width: '100%', left: 0 }}
              overlay={
                <ul className="user-options">
                  <li onClick={() => linkUser(userInfo.userId)}>
                    <UserOutlined /> 个人中心
                  </li>

                  <li className="user-msg" onClick={() => Router.push(`/msgCenter`)} >
                    <BellOutlined /> 我的信息

                    <span className="msg-num">
                      <Badge
                        count={msgData && msgData.length}
                        style={{ backgroundColor: 'rgba(245,34,45,.2)', color: 'red', boxShadow: 'none' }}
                      />
                    </span>
                  </li>
                  <li onClick={logout}>
                    <PoweroffOutlined /> 退出
                  </li>
                </ul>
              }>
              <Badge dot={msgData && msgData.length ? true : false}>
                <Avatar className="user-avatar" src={userInfo && userInfo.avatar} />
              </Badge>
            </Dropdown>
          </If>

          {
            userInfo && userInfo.userId ?
              null
              :
              <div key="2" className="writing" onClick={showLogin}>
                <MobileOutlined style={{ marginRight: 10 }} />
							登录
						</div>
          }
          <MenuOutlined style={{ fontSize: 20, marginLeft: 20 }} type="menu" onClick={() => setMuneVisible(true)} />

        </div>

        {/* 目录 */}
        <Drawer
          title={(
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              挺哥博客
              <IconFont
                type={returnTheme()}
                style={{ fontSize: 24, marginRight: 10 }}
                onClick={switchTheme}
              />
            </div>
          )}
          placement="right"
          closable={false}
          onClose={() => setMuneVisible(false)}
          visible={muneVisible}
          bodyStyle={{ padding: 0 }}
        >

          <If condition={ipWeather}>
            <div id='m-weathe-box' >
              <span>{ipWeather.address_detail.city}</span>
              <span>
                <If condition={weatherInfo && weatherInfo.now}>
                  <img style={{ width: 20, height: 20, marginRight: 5 }} src={`//cdn.lululuting.com/weather/${weatherInfo.now.icon} .png`} />
                </If>
                {/* {ipWeather[0].weather.weather} */}
              </span>
              {/* <span>{ipWeather[0].weather.temp}</span> */}
            </div>
          </If>

          <Search
            style={{ margin: '24px auto' }}
            className={classnames('search-input search-h5')}
            placeholder="请开始你的表演"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onSearch={onPressEnterLink}
          />

          <Menu mode="vertical" style={{ border: 'none' }} onClick={() => setMuneVisible(false)}>
            <Menu.Item key="1">
              <Link href='/list/[type]' as={`/list/1`}>
                <a>
                  <ExperimentOutlined />
									技术
								</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link href='/list/[type]' as={`/list/2`}>
                <a>
                  <CameraOutlined />
									摄影
								</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link href='/list/[type]' as={`/list/3`}>
                <a>
                  <CoffeeOutlined />
									生活
								</a>
              </Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </Row>
    </div>
  )
}

const stateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    msgData: state.msgData,
    loginLoading: state.loginLoading,
    currentArticleInfo: state.currentArticleInfo
  }
}

const dispatchToProps = (dispatch) => {
  return {
    userInfoChange(obj) {
      let action = {
        type: 'changeUserInfo',
        payload: obj
      }

      dispatch(action)
    }
  }
}

export default withRouter(connect(stateToProps, dispatchToProps)(Header))