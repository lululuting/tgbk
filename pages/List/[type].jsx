/*
 * @Author: TingGe
 * @Date: 2021-01-20 10:03:02
 * @LastEditTime: 2024-03-26 17:45:37
 * @LastEditors: TingGe
 * @Description: 列表页
 * @FilePath: /ting_ge_blog/pages/list/[type].jsx
 */

import React, { useState, useEffect } from 'react';
import Head from '@/components/Head';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { baseQueryList } from '@/public/utils/baseRequest';
import serviceApi from '@/config/service';
import ArticleList from '@/components/ArticleList';
import Advert from '@/components/Advert';
import PageLeftCard from '@/components/PageLeftCard';
import LazyImg from '@/components/LazyImg';
import { dictToArr, dict } from '@/public/utils/dict';
import _ from 'lodash';
import styles from './style.module.less';

const ListPage = (props) => {
  const [listData, setListData] = useState(props.listData || []);
  const [tabKey, setTabKey] = useState(props.type);
  const [bannerData] = useState(props.banner);
  // 页数
  const [page, setPage] = useState(1);
  const [isNoData, setIsNoData] = useState(false);
  const [listSort, setListSort] = useState(false);

  /**
   * 查询列表
   * @description: 查询列表方法
   * @param
   * @return: 文章列表
   */
  const queryList = async ({ type, sort, page }) => {
    return baseQueryList(serviceApi.getArticleList, {
      filters: {
        type: (type !== undefined ? type : tabKey)
      },
      page: page || 1,
      limit: 5,
      orderBy: (sort !== undefined ? sort : listSort) ? [['viewCount', 'desc'], ['id', 'desc']] : [['id', 'desc']]
    });
  };


  // 2022.03.06  处理头部点击分类列表时，只会改变路由但不会触发页面重新渲染
  useEffect(() => {
    setListData(props.listData || []);
    setTabKey(props.type * 1);
  }, [props.type]);

  // 切换排序
  const listSortFn = (sort) => {
    queryList({
      sort
    }).then((res) => {
      setListData(res?.data?.list || []);
    });

    setListSort(sort);
    setPage(1);
    setIsNoData(false);
  };

  // 加载更多
  const loadMore = () => {
    queryList({
      page: page + 1
    }).then((res) => {
      if (_.isEmpty(_.get(res, 'data.list'))) {
        setIsNoData(true);
        return;
      }
      setListData([].concat(listData, res?.data?.list || []));
    });
    setPage(page + 1);
  };

  // 切换
  const tabKeyChang = (key) => {
    queryList({
      type: key
    }).then((res) => {
      setListData(res?.data?.list || []);
    });
    setPage(1);
    setIsNoData(false);
    setTabKey(key);

    // 改变地址栏url
    if (window) {
      window.history.pushState(null, null, key);
    }
  };

  return (
    <>
      <Head>
        <title>挺哥博客-文章列表</title>
      </Head>

      <>
        <div className={styles['banner']}>
          <LazyImg background params="?imageslim" src={bannerData?.url} />
        </div>
        <Row>
          {/* 列表 */}
          <Col className={styles['left-box']} xs={24} sm={24} md={24} lg={18}
            xl={18}
          >
            <PageLeftCard
              bordered={false}
              tabList={
                _.map(dictToArr('articleType'), (item) => {
                  return {
                    key: item.value,
                    tab: <span>{item.label}</span>
                  };
                })
              }
              activeTabKey={tabKey}
              onTabChange={tabKeyChang}
              sortFn={listSortFn}
            >
              <ArticleList
                loadMore={loadMore}
                isNoData={isNoData}
                loading={props.listLoading}
                data={listData}
              />
            </PageLeftCard>
          </Col>

          <Col xs={0} sm={0} md={0} lg={6} xl={6}
            style={{ paddingLeft: 24 }}
          >
            <Advert />
          </Col>
        </Row>
      </>
    </>
  );
};

export async function getServerSideProps (context) {
  // topbanner
  const bannerPromise = new Promise((resolve) => {
    baseQueryList(serviceApi.getBannerList, {
      filters: {
        type: _.get(dict, 'bannerType.list'),
        status: _.get(dict, 'commonStatus.yes')
      },
      limit: 1
    }).then((res) => {
      resolve(res?.data?.list[0] || null);
    });
  });

  // list
  const listPromise = new Promise((resolve) => {
    baseQueryList(serviceApi.getArticleList, {
      filters: {
        type: context.query.type || _.get(dict, 'articleType.all')
      },
      limit: 5
    }).then((res) => {
      resolve(res?.data?.list || []);
    });
  });

  let banner = await bannerPromise;
  let listData = await listPromise;
  let type = context.query.type;

  return { props: { type, banner, listData } };
}

const stateToProps = (state) => {
  return {
    listLoading: state.getArticleListLoading
  };
};

export default connect(stateToProps, null)(ListPage);
