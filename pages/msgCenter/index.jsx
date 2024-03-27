/*
 * @Author: TingGe
 * @Date: 2021-01-25 15:27:53
 * @LastEditTime: 2023-06-14 15:50:07
 * @LastEditors: TingGe
 * @Description: 消息中心
 * @FilePath: /ting_ge_blog/pages/msgCenter/index.jsx
 */

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Head from '@/components/Head';
import { Row, Col, Card, Affix, Spin, Button, Divider } from 'antd';
import classNames from 'classnames';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import LazyImg from '@/components/LazyImg';
import MsgList from '@/components/MsgList';
import { connect } from 'react-redux';
import { dict } from '@/public/utils/dict';
import SvgIcon from '@/components/SvgIcon';
import { baseQueryList } from '@/public/utils/baseRequest';
import styles from './style.module.less';

const MsgPage = (props) => {
  const [tabKey, setTabKey] = useState(null);
  const [bannerData] = useState(props.banner);
  const [dataList, setDataList] = useState([]);
  // 页数
  const [page, setPage] = useState(1);
  const [isNoData, setIsNoData] = useState(false);

  const getMsgList = (type, page) => {
    return baseQueryList(serviceApi.getMsgList, {
      filters: {
        type: type !== undefined ? type : tabKey
      },
      page: page || 1,
      limit: 10,
      orderBy: [
        ['status', 'asc'],
        ['id', 'desc']
      ]
    });
  };

  useEffect(() => {
    // 消息列表就不做ssr啦
    getMsgList(tabKey, page).then((res) => {
      setDataList(res?.data?.list);
      // 不满就是没有更多了
      if (res.data?.list?.length !== 10) {
        setIsNoData(true);
      }
      // 消点
      request(serviceApi.getMsg).then((res) => {
        props.changeMsg(res.data);
      });
    });
  }, []);

  const navData = [
    {
      icon: <SvgIcon name="icontonggao"/>,
      key: null,
      text: '全部消息'
    },
    {
      icon: <SvgIcon name="iconxinjian"/>,
      key: _.get(dict, 'msgType.commentArticle') + '' + _.get(dict, 'msgType.commentReply'),
      text: '回复我的'
    },
    {
      icon: <SvgIcon name="icondianzan"/>,
      key: _.get(dict, 'msgType.likeArticle') + '' + _.get(dict, 'msgType.likeComment'),
      text: '收到的赞'
    },
    {
      icon: <SvgIcon name="iconpipei"/>,
      key: _.get(dict, 'msgType.follow'),
      text: '粉丝关注'
    },
    {
      icon: <SvgIcon name="icongonggao"/>,
      key: _.get(dict, 'msgType.system'),

      text: '系统通知'
    }
  ];

  // 加载更多
  const loadMore = (limit) => {
    setPage(page + 1);
    getMsgList(tabKey, page + 1).then((res) => {
      if (res?.data?.list?.length !== limit) {
        setIsNoData(true);
      }
      setDataList(_.unionWith(dataList, res?.data?.list, _.isEqual));
    });
  };

  // 切换消息类型
  const tabKeyChang = (key) => {
    setPage(1);
    setIsNoData(false);
    setTabKey(key);
    getMsgList(key, 1).then((res) => {
      setDataList(res?.data?.list);
      // 不满就是没有更多了
      if (res.data?.list?.length !== 10) {
        setIsNoData(true);
      }
    });
  };

  // 格式化标题
  const formatTitle = (key) => {
    return navData.filter((item) => {
      return item.key === key;
    })[0];
  };

  return (
    <>
      <Head>
        <title>挺哥博客-消息中心</title>
      </Head>

      <>
        <div className={styles['banner']}>
          <LazyImg
            background
            params="?imageslim"
            src={bannerData && bannerData.url && bannerData.url}
          />
        </div>

        <Row className={styles['msg-page']}>
          {/* 这里分两份代码 pc 和移动 这样子最省事 */}
          <Col
            xs={0}
            sm={0}
            md={0}
            lg={5}
            xl={5}
            className={styles['left-nav-box']}
            style={{ paddingRight: 24 }}
          >
            <Affix offsetTop={68}>
              <Card bordered={false}>
                <ul className={styles['left-nav-list']}>
                  {_.map(navData, (item) => {
                    return (
                      <li
                        key={item.key}
                        className={tabKey == item.key ? 'active' : ''}
                        onClick={() => tabKeyChang(item.key)}
                      >
                        {item.icon}
                        {item.text}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </Affix>
          </Col>

          {/* 移动端不用固定 */}
          <Col xs={24} sm={24} md={0} lg={0} xl={0}
            className={styles['left-nav-box']}
          >
            <Card style={{ marginBottom: 20 }} bordered={false}>
              <ul className={styles['left-nav-list']}>
                {_.map(navData, (item) => {
                  return (
                    <li
                      key={item.key}
                      className={tabKey == item.key ? 'active' : ''}
                      onClick={() => tabKeyChang(item.key)}
                    >
                      {item.icon}
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Col>

          {/* 列表 */}
          <Col id="left-box" xs={24} sm={24} md={24} lg={19}
            xl={19}
          >
            <div className={classNames(styles['data-list'])}>
              <Card
                bordered={false}
                title={
                  <>
                    {formatTitle(tabKey).icon}
                    {formatTitle(tabKey).text}
                  </>
                }
              >
                <Spin spinning={props.getMsgListLoading}>
                  <MsgList data={dataList} />
                  {!_.isEmpty(dataList) ? (
                    <div>
                      {!isNoData ? (
                        <div
                          style={{
                            textAlign: 'center',
                            marginBottom: 24,
                            marginTop: 24
                          }}
                        >
                          <Button
                            type="primary"
                            className={'load-more-btn'}
                            shape="round"
                            loading={props.getMsgListLoading}
                            onClick={() => loadMore(10)}
                          >
                            加载更多
                          </Button>
                        </div>
                      ) : (
                        <div className={classNames(styles['bottom-tips'])}>
                          <Divider>暂时只有这么多了</Divider>
                        </div>
                      )}
                    </div>
                  ) : null}
                </Spin>
              </Card>
            </div>
          </Col>
        </Row>
      </>
    </>
  );
};

export async function getServerSideProps () {
  const promise = new Promise((resolve) => {
    request(serviceApi.getListBanner).then((res) => {
      resolve(res.data);
    });
  });

  let banner = await promise;

  return { props: { banner } };
}

const stateToProps = (state) => {
  return {
    msgData: state.msgData,
    getMsgListLoading: state.getMsgListLoading
  };
};

const dispatchToProps = (dispatch) => {
  return {
    changeMsg (obj) {
      dispatch({
        type: 'changeMsg',
        payload: obj
      });
    }
  };
};

export default connect(stateToProps, dispatchToProps)(MsgPage);
