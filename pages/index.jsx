/*
 * @Author: TingGe
 * @Date: 2021-01-15 10:35:31
 * @LastEditTime: 2021-03-01 22:16:56
 * @LastEditors: TingGe
 * @Description: 首页
 * @FilePath: /ting_ge_blog/pages/index.jsx
 */

import React, { useState, useRef } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import { Row, Col, Carousel, Card } from 'antd'
import classnames from 'classnames'
import serviceApi from '@/config/service'
import request from '@/public/utils/request'
import UpInfo from '@/components/UpInfo'
import ArticeList from '@/components/ArticeList'
import LazyImg from '@/components/LazyImg'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import '@/public/style/index.less'

const Home = (props) => {

  // 轮播图
  const [bannerData, setBannerData] = useState(props.banenrList.banner)
  const [topBanner, setTopBanner] = useState(props.banenrList.topBanner)
  const bannerRef = useRef();

  // 推荐
  const [rightBanner, setRightBanner] = useState(props.banenrList.rightBanner)

  // 广告
  const [advert, setAdvert] = useState(props.banenrList.advert)

  // tabkey
  const [tabKey, setTabKey] = useState('0')

  // 文章列表
  const [articleList, setArticleList] = useState(props.list)

  const [upList, setUpList] = useState(props.userList)

  const [energyData, setEnergyData] = useState(props.energy)

  // 页数
  const [page, setPage] = useState(1)
  const [isNoData, setIsNoData] = useState(false)

  // swiper配置
  const swiperOption = {
    touchMove: true,
    speed: 1000,
    autoplaySpeed: 5000,
    draggable: true,
    // effect: "fade"
  }


  // 加载更多
  const loadMore = () => {
    setPage(page + 1)

    request(serviceApi.getArticleList, {
      method: 'get',
      params: {
        id: tabKey,
        page: page + 1,
        limit: 5,
      }
    }).then((res) => {
      if (!res.data.length) {
        setIsNoData(true)
        return
      }

      setArticleList([].concat(articleList, res.data))
    })
  }


  // 最新/最热 切换
  const tabKeyChang = (key) => {
    setTabKey(key)
    setPage(1)
    setIsNoData(false)

    request(serviceApi.getArticleList, {
      method: 'get',
      params: {
        id: key,
        page: 1,
        limit: 5,
      }
    }).then((res) => {
      setArticleList(res ? res.data : [])
    })
  }

  const operationTabList = [
    {
      key: '0',
      tab: (
        <span>
          最 新
        </span>
      ),
    },
    {
      key: '1',
      tab: (
        <span>
          热 门
        </span>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>挺哥博客-网上冲浪的记录站</title>
      </Head>

      <>
        <Row className="header-banner-box">
          <Col xs={0} sm={0} md={24}>
            <div className="header-banner">
              <LazyImg background={true} params="?imageslim" src={topBanner?.url || null} >
                <div className="header-content">
                  <a className="tips-text" href={topBanner?.link !== '无' ? topBanner.link : null} target="_blank">
                    {topBanner?.title !== '无' ? topBanner.title : null}
                  </a>
                </div>
              </LazyImg>
            </div>
          </Col>
        </Row>

        {/* banner */}
        <Row className={classnames('wrap index-banner')}>
          <Col xs={24} sm={24} md={17} >
            <div
              className={classnames('left')}
              style={{ maxWidth: 830 }}
            >
              <Carousel 
                autoplay
                {...swiperOption}
                ref={bannerRef}
                lazyLoad
                infinite
                slidesToShow={1}
                slidesToScroll={1}
              >
                <For each="item" of={bannerData}>
                  <a key={index} className="banner-item" target="_blank" href={item.link}>
                    <img src={item.url} className="swiper-lazy" />
                    <div className="swiper-lazy-preloader"></div>
                  </a>
                </For>
              </Carousel>

              {/* 左右切换，小于一张隐藏 */}
              <If condition={bannerData.length > 1}>
                <span className={classnames('slide-btn left-btn')} onClick={() => bannerRef.current.prev()}>
                  <LeftOutlined />
                </span>
                <span className={classnames('slide-btn right-btn')} onClick={() => bannerRef.current.next()}>
                  <RightOutlined />
                </span>
              </If>
            </div>
          </Col>

          <Col xs={24} sm={24} md={7} className="right">
            <For each="item" of={rightBanner}>
              <a key={index} className={classnames("img-focus banner-item ")} target="_blank" href={item.link}>
                <LazyImg background src={item.url} params="?imageView2/1/w/350/h/190" alt={item.title} />
                <span className="banner-text">{item.title}</span>
              </a>
            </For>
          </Col>

        </Row>

        <div className={classnames('wrap content-box')}>
          <Row>
            {/* 列表 */}
            <Col xs={24} sm={24} md={24} lg={18} xl={18} id='left-box'>
              <div className={classnames('list-nav')}>
                <Card
                  bordered={false}
                  tabList={operationTabList}
                  activeTabKey={tabKey}
                  onTabChange={tabKeyChang}
                >
                  <ArticeList
                    loadMore={loadMore}
                    isNoData={isNoData}
                    typeTag
                    loading={props.listLoading}
                    data={articleList}
                  />
                </Card>
              </div>
            </Col>

            <Col xs={0} sm={0} md={0} lg={6} xl={6}>
              {/* 正能量位 */}
              <If condition={energyData.imgurl}>
                <Card
                  style={{ marginBottom: 24 }}
                  bordered={false}
                >
                  <p style={{ fontWeight: 'bold' }}>每日一句</p>
                  <LazyImg src={energyData.imgurl} />
                  <div style={{ textIndent: '2em', marginTop: 10 }}>{energyData.ciba}</div>
                </Card>
              </If>

              {/* up信息列表 */}
              <Card bordered={false} >
                <p style={{ fontWeight: 'bold', textAlign: 'left' }}>优秀博主</p>
                <Carousel autoplay {...swiperOption} className="up-info">
                  <For each="item" of={upList}>
                    <div key={item.id}>
                      <UpInfo data={item} link />
                    </div>
                  </For>
                </Carousel>
              </Card>

              {/* 广告位 */}
              <For each="item" of={advert}>
                <Card
                  style={{ marginTop: 24 }}
                  bordered={false}
                  key={item.id}
                >
                  <p style={{ fontWeight: 'bold' }}>广告</p>
                  <a href={item.link}>
                    <LazyImg src={item.url} params="?imageslim" />
                  </a>
                </Card>
              </For>

            </Col>
          </Row>
        </div>
      </>
    </>
  )
}

export async function getServerSideProps() {

  // getBannerList
  const promise = new Promise((resolve) => {
    request(serviceApi.getBannerList, {
      method: 'get',
    }).then((res) => {
      resolve(res ? res.data : [])
    })
  })

  // 最新
  const promise1 = new Promise((resolve) => {
    request(serviceApi.getArticleList, {
      method: 'get',
      params: { id: 0, page: 1, limit: 5 }
    }).then((res) => {
      resolve(res ? res.data : [])
    })
  })

  // up列表
  const promise2 = new Promise((resolve) => {
    request(serviceApi.getUserList, {
      method: 'get',
    }).then((res) => {
      resolve(res ? res.data : [])
    })
  })

  // 金山每日一句正能量
  const promise3 = new Promise((resolve) => {
    request(serviceApi.getYitu, {
      method: 'get',
    }).then((res) => {
      resolve({
        imgurl: res.data.picture,
        ciba: res.data.note,
      })
    }).catch((err) => {
      resolve({
        imgurl: '//cdn.lululuting.com/api_err_img.png',
        ciba: '快去告诉挺哥，每日一句的接口炸了！'
      })
    })
  })

  let banenrList = await promise
  let list = await promise1
  let userList = await promise2
  let energy = await promise3

  return { props: { banenrList, list, userList, energy } }
}

const stateToProps = (state) => {
  return {
    listLoading: state.getArticleListLoading
  }
}


export default connect(stateToProps, null)(Home)