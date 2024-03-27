/*
 * @Author: TingGe
 * @Date: 2021-01-25 15:20:41
 * @LastEditTime: 2023-06-05 16:03:45
 * @LastEditors: TingGe
 * @Description: 搜索页
 * @FilePath: /ting_ge_blog/pages/search/[...search].jsx
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Head from '@/components/Head';

import Link from 'next/link';
import { Row, Col, Avatar, Card, Affix, Button, Divider } from 'antd';
import classnames from 'classnames';
import request from '@/public/utils/request';
import { baseQueryList } from '@/public/utils/baseRequest';
import serviceApi from '@/config/service';
import ArticleList from '@/components/ArticleList';
import LazyImg from '@/components/LazyImg';
import _ from 'lodash';
import { dict } from '@/public/utils/dict';
import Router from 'next/router';
import ArticleSort from '@/components/ArticleSort';
import {
  ReadOutlined,
  UserOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import styles from './style.module.less';

const { Meta } = Card;

const SearchPage = (props) => {
  const [listData, setListData] = useState(props.articleList);
  const [bannerData] = useState(props.banner);
  const [tabKey, setTabKey] = useState(props.searchType * 1);
  const [searchVal, setSearchVal] = useState(props.searchText);
  const [page, setPage] = useState(1);
  const [isNoData, setIsNoData] = useState(false);
  const [listSort, setListSort] = useState(false);


  /**
 * 搜索列表方法
 * @description: 公用搜索列表
 * @param
 * @return: 文章列表/用户列表
 */
  const queryList = async ({ tabKey, sort, page }) => {
    let orderBy = [['id', 'desc']];
    if (tabKey === 'article') {
      orderBy = sort ? [['viewCount', 'desc'], ['id', 'desc']] : [['id', 'desc']];
    }

    return baseQueryList(serviceApi.getSearchList, {
      filters: {
        type: tabKey,
        searchVal
      },
      page: page || 1,
      limit: 5,
      orderBy
    });
  };

  // 切换排序
  const listSortFn = () => {
    queryList({
      tabKey,
      sort: !listSort
    }).then((res) => {
      setListData(res?.data?.list || []);
    });

    setListSort(!listSort);
    setPage(1);
    setIsNoData(false);
  };


  // 加载更多
  const loadMore = () => {
    queryList({
      tabKey,
      page: page + 1,
      listSort
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
    setIsNoData(false);
    setPage(1);
    Router.push('/search/[...search]', `/search/${key}/${searchVal}`);
  };

  useEffect(() => {
    setTabKey(props.searchType);
    setSearchVal(props.searchText);
    setListData(props.articleList);
  }, [props.searchType, props.searchText]);
  return (
    <>
      <Head>
        <title>挺哥博客-搜索列表</title>
      </Head>

      <>
        <div className={styles["banner"]}>
          <LazyImg
            background
            params="?imageslim"
            src={bannerData && bannerData.url && bannerData.url}
          />
        </div>

        <Row className={styles["search-page"]}>
          {/* 这里分两份代码 pc 和移动 这样子最省事 */}
          <Col
            xs={0}
            sm={0}
            md={6}
            lg={6}
            xl={6}
            className={styles["left-nav-box"]}
            style={{ paddingRight: 24 }}
          >
            <Affix offsetTop={68}>
              <Card bordered={false}>
                <ul className={styles["left-nav-list"]}>
                  <li
                    className={
                      tabKey === _.get(dict, 'searchType.article')
                        ? styles['active']
                        : ''
                    }
                    onClick={() =>
                      tabKeyChang(_.get(dict, 'searchType.article'))
                    }
                  >
                    <ReadOutlined /> 文章
                  </li>

                  <li
                    className={
                      tabKey === _.get(dict, 'searchType.user') ?  styles['active'] : ''
                    }
                    onClick={() => tabKeyChang(_.get(dict, 'searchType.user'))}
                  >
                    <UserOutlined /> 用户
                  </li>
                </ul>
              </Card>
            </Affix>
          </Col>

          {/* 移动端不用固定 */}
          <Col xs={24} sm={24} md={0} lg={0} xl={0}
            className={styles["left-nav-box"]}
          >
            <Card style={{ marginBottom: 20 }} bordered={false}>
              <ul className={styles["left-nav-list"]}>
                <li
                  className={
                    tabKey === _.get(dict, 'searchType.article') ? styles['active'] : ''
                  }
                  onClick={() => tabKeyChang(_.get(dict, 'searchType.article'))}
                >
                  <ReadOutlined /> 文章
                </li>

                <li
                  className={
                    tabKey === _.get(dict, 'searchType.user') ?  styles['active'] : ''
                  }
                  onClick={() => tabKeyChang(_.get(dict, 'searchType.user'))}
                >
                  <UserOutlined /> 用户
                </li>
              </ul>
            </Card>
          </Col>

          {/* 列表 */}
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <div className={styles['data-list']}>
              <Card
                bordered={false}
                title={
                  <>
                    <FileSearchOutlined
                      className={styles["search-result-icon"]}
                      style={{ color: '#1890ff', marginRight: 10 }}
                    />
                    搜索结果
                  </>
                }
                extra={
                  tabKey === _.get(dict, 'searchType.article') ? (
                    <ArticleSort onChange={listSortFn}/>
                  ) : null
                }
              >
                {tabKey === _.get(dict, 'searchType.article') ? (
                  <ArticleList
                    loadMore={loadMore}
                    isNoData={isNoData}
                    loading={props.loadMoreLoading}
                    data={listData}
                    search={searchVal}
                  />
                ) : (
                  <Row gutter={20}>
                    {!_.isEmpty(listData) ? (
                      <>
                        {_.map(listData, (item) => {
                          return (
                            <Col xs={24} xm={12} lm={12} lg={12} key={item.id}>
                              <Link
                                href="/userCenter/[id]"
                                as={`/userCenter/${item.id}`}
                              >
                                <a>
                                  <Card
                                    bodyStyle={{ padding: 20 }}
                                    className={styles["user-list"]}
                                    bordered={false}
                                    loading={props.loadMoreLoading}
                                  >
                                    <Meta
                                      avatar={
                                        <Avatar size={60} src={item.avatar} />
                                      }
                                      title={item.userName}
                                      description={item.autograph}
                                    />
                                  </Card>
                                </a>
                              </Link>
                            </Col>
                          );
                        })}
                        <Col xs={24}>
                          {!isNoData ? (
                            <div
                              style={{
                                textAlign: 'center',
                                marginBottom: 24,
                                marginTop: 24
                              }}
                            >
                              <Button
                                loading={props.loadMoreLoading}
                                onClick={() => loadMore(10)}
                              >
                                加载更多
                              </Button>
                            </div>
                          ) : (
                            <div className={styles['bottom-tips']}>
                              <Divider>暂时只有这么多了</Divider>
                            </div>
                          )}
                        </Col>
                      </>
                    ) : (
                      <div className={"ant-list-empty-text"}>
                        ㄟ( ▔, ▔ )ㄏ 暂无数据
                      </div>
                    )}
                  </Row>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </>
    </>
  );
};

export async function getServerSideProps (context) {
  const searchType = context.query.search[0];
  const searchText = context.query.search[1] || '';
  const promise = new Promise((resolve) => {
    baseQueryList(serviceApi.getSearchList, {
      filters: {
        type: searchType,
        searchVal: searchText
      },
      page: 1,
      limit: searchType === _.get(dict, 'searchType.user') ? 10 : 5, // 文章查5 用户查10
      orderBy: [['id', 'desc']]
    }).then((res) => {
      resolve(res?.data?.list || []);
    });
  });

  const promise1 = new Promise((resolve) => {
    request(serviceApi.getSearchBanner).then((res) => {
      resolve(res.data);
    });
  });

  let articleList = await promise;
  let banner = await promise1;

  return { props: { articleList, banner, searchType, searchText } };
}

const stateToProps = (state) => {
  return {
    loadMoreLoading: state.getSearchListLoading
  };
};

export default connect(stateToProps, null)(SearchPage);
