/*
 * @Date: 2019-12-30 22:22:32
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-20 00:11:57
 * @FilePath: \ting_ge_blog\pages\index\index.js
 */

import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import { Row, Col, Carousel, Icon, Card } from 'antd'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import serviceApi from '@/config/service'
import request from '@/public/utils/request'


import './style.less'

const UpInfo = dynamic(import('@/components/UpInfo'))
const ArticeList = dynamic(import('@/components/ArticeList'))
const LazyImg = dynamic(import('@/components/LazyImg'))


const Home = (props) => {

  const bannerRef = useRef();

  // 轮播图
  const [bannerData, setBannerData] = useState(props.banenrList.banner)
  const [topBanner, setTopBanner] = useState(props.banenrList.topBanner)

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
    autoplay: true,
    touchMove: true,
    speed: 2000,
    draggable: true,
  }

  // swiper配置
  const upSwiperOption = {
    touchMove: true,
    speed: 5000,
    draggable: true,
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


  useEffect(() => {
  }, [])


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
              <LazyImg background={true} params="?imageslim" src={topBanner && topBanner.url ? topBanner.url : null} >
                <div className="header-content">
                  <a className="tips-text" href={topBanner && topBanner.link && topBanner.link !== '无' ? topBanner.link : null} target="_blank">
                    {topBanner && topBanner.title && topBanner.title !== '无' ? topBanner.title : null}
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
              className={classnames('img-focus left')}
              onMouseMove={() => bannerRef.current.slick.slickPause()}
              onMouseOut={() => bannerRef.current.slick.slickPlay()}
            >
              <Carousel {...swiperOption} ref={bannerRef}>
                {
                  bannerData && bannerData.length ? bannerData.map((item, index) => (
                    <a key={index} className="banner-item" target="_blank" href={item.link} >
                      <LazyImg src={item.url} params="?imageView2/1/w/830/h/400" alt={item.title} />
                    </a>
                  )) : null
                }
              </Carousel>

              {/* 左右切换，小于一张隐藏 */}
              {
                bannerData && bannerData.length ?
                  <>
                    <span className={classnames('slide-btn left-btn')} onClick={() => bannerRef.current.slick.slickPrev()}>
                      <Icon type="left" />
                    </span>
                    <span className={classnames('slide-btn right-btn')} onClick={() => bannerRef.current.slick.slickNext()}>
                      <Icon type="right" />
                    </span>
                  </> : null
              }
            </div>
          </Col>
          <Col xs={24} sm={24} md={7} className="right">
            {
              rightBanner && rightBanner.length ? rightBanner.map((item, index) => (
                <a key={index} className={classnames("img-focus banner-item ")} target="_blank" href={item.link}>
                  <LazyImg src={item.url} params="?imageView2/1/w/350/h/190" alt={item.title} />
                  <span className="banner-text">{item.title}</span>
                </a>
              )) : null
            }
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
              <>
                {
                  energyData && energyData.imgurl ?
                    <Card
                      style={{ marginBottom: 24 }}
                      bordered={false}
                    >
                      <p style={{ fontWeight: 'bold' }}>每日一句</p>
                      <LazyImg src={energyData.imgurl} />
                      <div style={{ textIndent: '2em', marginTop: 10 }}>{energyData.ciba}</div>
                    </Card>
                    : null
                }
              </>


              {/* up信息列表 */}
              <Card bordered={false} >

                <p style={{ fontWeight: 'bold', textAlign: 'left' }}>优秀博主</p>

                <Carousel autoplay {...upSwiperOption} className="up-info">
                  {
                    upList && upList.length && upList.map((item, index) => (
                      <div key={item.id}>
                        <UpInfo data={item} link />
                      </div>
                    ))
                  }
                </Carousel>
              </Card>




              {/* 广告位 */}
              <>
                {
                  advert && advert.length ? advert.map((item, index) => (
                    <Card
                      style={{ marginTop: 24 }}
                      bordered={false}
                      key={index}
                    >
                      <p style={{ fontWeight: 'bold' }}>广告</p>
                      <a href={item.link}>
                        <LazyImg src={item.url} params="?imageslim" />
                      </a>
                    </Card>
                  )) : null
                }
              </>

            </Col>
          </Row>
        </div>
      </>
    </>
  )
}

Home.getInitialProps = async () => {

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
    request('http://api.youngam.cn/api/one.php', {
      method: 'get',
      mode: "cors",
    }).then((res) => {
      resolve({
        imgurl: res.data[0].src,
        ciba: res.data[0].text,
      })
    }).catch((err) => {
      resolve({
        imgurl: '/static/api_err_img.png',
        ciba: '快去告诉挺哥，每日一句的接口炸了！'
      })

    })
  })

  let banenrList = await promise
  let list = await promise1
  let userList = await promise2
  let energy = await promise3

  return { banenrList, list, userList, energy }
}

const stateToProps = (state) => {
	return {
		listLoading: state.getArticleListLoading
	}
}


export default connect(stateToProps, null)(Home)

