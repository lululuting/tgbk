/*
 * @Author: TingGe
 * @Date: 2021-01-15 10:35:31
 * @LastEditTime: 2023-06-14 16:15:14
 * @LastEditors: TingGe
 * @Description: 首页
 * @FilePath: /ting_ge_blog/pages/index.jsx
 */

import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import Head from 'next/head';
import { connect } from 'react-redux';
import { Row, Col, Carousel, Card } from 'antd';
import classnames from 'classnames';
import serviceApi from '@/config/service';
import request from '@/public/utils/request';
import UpInfo from '@/components/UpInfo';
import ArticleList from '@/components/ArticleList';
import PageLeftCard from '@/components/PageLeftCard';
import Advert from '@/components/Advert';
import LazyImg from '@/components/LazyImg';
import SvgIcon from '@/components/SvgIcon';
import { dict } from '@/public/utils/dict';
import { baseQueryList } from '@/public/utils/baseRequest';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from '@/public/styles/index.module.less';

const Home = (props) => {
  // 轮播图
  const [bannerData] = useState(props.bannerList.banner);
  const [topBanner] = useState(props.bannerList.topBanner);
  const bannerRef = useRef();

  // 推荐
  const [rightBanner] = useState(props.bannerList.rightBanner);

  // 广告
  const [advert] = useState(props.bannerList.advert);

  // sort
  const [listSort, setListSort] = useState(false);

  // 文章列表
  const [articleList, setArticleList] = useState(props.articleList);

  const [upList] = useState(props.userList);

  const [energyData] = useState(props.energy);

  // 页数
  const [page, setPage] = useState(1);
  const [isNoData, setIsNoData] = useState(false);

  // swipe配置
  const swipeOption = {
    touchMove: true,
    speed: 1000,
    autoplaySpeed: 5000,
    draggable: true
    // effect: "fade"
  };


  /**
   * 查询列表
   * @description: 查询列表方法
   * @param
   * @return: 文章列表
   */
  const queryList = async ({ page, sort}) => {
    return baseQueryList(serviceApi.getArticleList, {
      status: _.get(dict, 'commonStatus.yes'),
      state: _.get(dict, 'commonStatus.yes'),
      page: page || 1,
      limit: 5,
      orderBy: (sort !== undefined ? sort : listSort) ? [['viewCount', 'desc'], ['id', 'desc']] : [['id', 'desc']]
    });
  };


  // 加载更多
  const loadMore = () => {
    queryList({
      page: page + 1
    }).then((res)=>{
      // 不满就是没有更多了
      if (res.data?.list?.length !== 5) {
        setIsNoData(true);
      }

      setArticleList([].concat(articleList, res?.data?.list || []));
    });

    setPage(page + 1);
  };

  // 最新/最热 切换
  const sortChang = (sort) => {
    queryList({
      sort,
      page: 1
    }).then((res)=>{
      setArticleList(res?.data?.list || []);
    });

    setPage(1);
    setIsNoData(false);
    setListSort(sort);
  };

  // 文字动画
  useEffect(() => {
    const text = document.querySelector('#energy');
    text.innerHTML = text.textContent.replace(/\S/g, '<span>$&</span>');
    const letters = document.querySelectorAll('#energy span');
    let time = 0;

    for (let i = 0; i < letters.length; i++) {
      time += 200;
      setTimeout(() => {
        letters[i].classList.add('active');
      }, time);
    }
  }, []);

  return (
    <>
      <Head>
        <title>挺哥博客-网上冲浪的记录站</title>
      </Head>

      <>
        <Row className={styles['header-banner-box']}>
          <Col xs={0} sm={0} md={24}>
            <div className={styles['header-banner']}>
              {
                topBanner?.type === _.get(dict,'bannerType.homeIframe') ?
                <iframe src={topBanner?.url} className={styles['theme-page-box']} />
                :
                <React.Fragment>
                  <LazyImg
                    background
                    src={topBanner?.url}
                    alt={topBanner?.title}
                    width={1920}
                    height={200}
                  /> 
                    <div className={styles['header-content']}>
                      {
                      topBanner?.title ?
                        <a
                          className={styles['tips-text']}
                          href={topBanner?.link}
                          target="_blank"
                          rel="noreferrer"
                        >{topBanner.title}</a>
                      :null
                    }
                  </div>
                </React.Fragment>
              }
            </div>
          </Col>
        </Row>


        <Row className={classnames('wrap', styles['index-banner'])}>
          <Col xs={24} sm={24} md={17}>
            <div className={styles['left']} style={{ maxWidth: 830 }}>
              <Carousel
                autoplay
                {...swipeOption}
                ref={bannerRef}
                lazyLoad
                infinite
                slidesToShow={1}
                slidesToScroll={1}
              >
                {_.map(bannerData, (item) => {
                  return (
                    <a
                      key={item.id}
                      className={styles['banner-item']}
                      target="_blank"
                      href={item.link}
                      rel="noreferrer"
                    >
                      <LazyImg
                        src={item.url}
                        className={styles['swiper-lazy']}
                        width={830}
                        height={400}
                        alt={item.title}
                      />
                      <div className={styles['swiper-lazy-preloader']} />
                    </a>
                  );
                })}
              </Carousel>

              {_.isEmpty(bannerData) ? null : (
                <>
                  <span
                    className={classnames(styles['slide-btn'], styles['left-btn'])}
                    onClick={() => bannerRef.current.prev()}
                  >
                    <LeftOutlined />
                  </span>
                  <span
                    className={classnames(styles['slide-btn'], styles['right-btn'])}
                    onClick={() => bannerRef.current.next()}
                  >
                    <RightOutlined />
                  </span>
                </>
              )}
            </div>
          </Col>

          <Col xs={24} sm={24} md={7} className={styles['right']}>
            {_.map(rightBanner, (item) => {
              return (
                <a
                  key={item.id}
                  className={classnames(styles['img-focus'], styles['banner-item'])}
                  target="_blank"
                  href={item.link}
                  rel="noreferrer"
                >
                  <LazyImg
                    src={item.url}
                    width={350}
                    height={180}
                    alt={item.title}
                  />
                  <span className={styles['banner-text']}>{item.title}</span>
                </a>
              );
            })}
          </Col>
        </Row>

        <div className={classnames('wrap', styles['content-box'])}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={18} xl={18}
              className={styles['left-box']}
            >
              <PageLeftCard
                bordered={false}
                sortFn={sortChang}
                title={
                  <div className={styles['list-title']}>
                    <SvgIcon name="iconrizhi1" style={{ fontSize: 24 }} />
                      满分作文
                  </div>
                }
              >
                <ArticleList
                  loadMore={loadMore}
                  isNoData={isNoData}
                  typeTag
                  loading={props.listLoading}
                  data={articleList}
                />
              </PageLeftCard>
            </Col>
            <Col xs={0} sm={0} md={0} lg={6} xl={6}>
              {energyData.imgUrl ? (
                <Card className={styles['every-day-one']} bordered={false}>
                  <p className={styles['one-title']}>
                    <SvgIcon name="iconbianqian" />
                    每日鸡汤
                  </p>
                  <div style={{ height: 140 }}>
                    <LazyImg
                      width={200}
                      height={120}
                      background
                      alt={'每日鸡汤'}
                      src={energyData?.imgUrl}
                    />
                  </div>
                  <div id="energy">{energyData?.note}</div>
                </Card>
              ) : null}

              <Card bordered={false} className={styles['hot-up-box']}>
                <p className={styles['up-title']}>
                  <SvgIcon name="iconxunzhang" />
                  整活UP
                </p>
                <Carousel autoplay {...swipeOption} className={styles['up-info']}>
                  {_.map(upList, (item) => {
                    return (
                      <div key={item.id}>
                        <UpInfo data={item} link />
                      </div>
                    );
                  })}
                </Carousel>
              </Card>

              <Advert data={advert} style={{ marginTop: 24 }} />
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};

export async function getServerSideProps () {
  const promise = new Promise((resolve) => {
    request(serviceApi.getHomeBannerList, {
      method: 'get'
    }).then((res) => {
      resolve(res?.data || null);
    });
  });

  // 最新
  const promise1 = new Promise((resolve) => {
    baseQueryList(serviceApi.getArticleList, {
      filters: {
        status: _.get(dict, 'commonStatus.yes'),
        state: _.get(dict, 'commonStatus.yes')
      },
      limit: 5
    }).then((res) => {
      resolve(res?.data?.list || null);
    });
  });

  // up列表 粉丝前5
  const promise2 = new Promise((resolve) => {
    request(serviceApi.getHotUserList).then((res) => {
      resolve(res?.data || null);
    });
  });

  // 金山每日一句正能量
  const promise3 = new Promise((resolve) => {
    request(serviceApi.getYitu)
      .then((res) => {
        resolve({
          imgUrl: res?.data?.picture,
          note: res?.data?.note
        });
      })
      .catch(() => {
        resolve({
          imgUrl: '//cdn.lululuting.com/api_err_img.png',
          note: '快去告诉挺哥，每日一句的接口炸了！'
        });
      });
  });
  let bannerList = await promise;
  let articleList = await promise1;
  let userList = await promise2;
  let energy = await promise3;

  return { props: { bannerList, articleList, userList, energy } };
}

const stateToProps = (state) => {
  return {
    listLoading: state.getArticleListLoading
  };
};

export default connect(stateToProps, null)(Home);
