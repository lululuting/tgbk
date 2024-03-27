/*
 * @Author: TingGe
 * @Date: 2021-01-24 16:53:10
 * @LastEditTime: 2023-06-14 15:18:11
 * @LastEditors: TingGe
 * @Description: 个人中心
 * @FilePath: /ting_ge_blog/pages/userCenter/[id].jsx
 */

import React, { useState, useEffect } from 'react';
import Head from '@/components/Head';
import FileUploader from '@/components/FileUploader';
import { withRouter } from 'next/router';
import Link from 'next/link';
import _ from 'lodash';
import {
  Row,
  Col,
  Card,
  Button,
  message,
  Avatar,
  Divider,
  Typography,
  Spin,
  Tooltip
} from 'antd';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import ArticleList from '@/components/ArticleList';
import LazyImg from '@/components/LazyImg';
import TagsAdd from '@/components/TagsAdd';
import Contact from '@/components/Contact';
import Rewards from '@/components/Rewards';
import ArticleSort from '@/components/ArticleSort';
import SvgIcon from '@/components/SvgIcon';
import { baseQueryList } from '@/public/utils/baseRequest';
import { dict } from '@/public/utils/dict';
import {
  CloudUploadOutlined,
  QuestionCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';
import BindMobileForm from './bindMobileForm';
import EditSongsForm from './editSongsForm';
import EditPasswordForm from './editPasswordForm';
import styles from './style.module.less';

const { Paragraph } = Typography;
const { Meta } = Card;

const UserCenter = (props) => {
  const [userInfo, setUserInfo] = useState(props.userInfoData);
  const [articleTotal, setArticleTotal] = useState(props.articleTotalData);
  const [tabKey, setTabKey] = useState(_.get(dict, 'articleType.all'));
  const [tabActive, setTabActive] = useState(1);
  const [listData, setListData] = useState(props.userArticleList);
  const [followStatus, setFollowStatus] = useState(
    props?.userInfoData?.fansStatus
  );
  const [settingStatus, setSettingStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mobileModalVisible, setMobileModalVisible] = useState(false);
  const [songsModalVisible, setSongsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [isNoData, setIsNoData] = useState(false);
  const [listSort, setListSort] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const operationTabList = [
    {
      key: _.get(dict, 'articleType.all'),
      tab: (
        <span>
          全部
          <span style={{ fontSize: 14, marginLeft: 5 }}>
            (
            {_.get(articleTotal, 'js', 0) +
              _.get(articleTotal, 'sy', 0) +
              _.get(articleTotal, 'shh', 0)}
            )
          </span>
        </span>
      )
    },
    {
      key: _.get(dict, 'articleType.skill'),
      tab: (
        <span>
          技术
          <span style={{ fontSize: 14, marginLeft: 5 }}>
            ({_.get(articleTotal, 'js', 0)})
          </span>
        </span>
      )
    },
    {
      key: _.get(dict, 'articleType.photography'),
      tab: (
        <span>
          摄影
          <span style={{ fontSize: 14, marginLeft: 5 }}>
            ({_.get(articleTotal, 'sy', 0)})
          </span>
        </span>
      )
    },
    {
      key: _.get(dict, 'articleType.life'),
      tab: (
        <span>
          生活
          <span style={{ fontSize: 14, marginLeft: 5 }}>
            ({_.get(articleTotal, 'shh', 0)})
          </span>
        </span>
      )
    }
  ];

  const fansLimit = 10;
  const userId = _.get(props, 'router.query.id') * 1;
  const loginUserInfo = Cookies.getJSON('userInfo');


  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 解决ssr 水合的问题
  if (!hasMounted) {
    return null;
  }

  /**
   * 查询列表方法
   * @description: 查询列表方法
   * @param
   * @return: 文章列表
   */
  const queryList = async ({ type, sort, page }) => {
    return baseQueryList(serviceApi.getArticleList, {
      filters: {
        type: type !== undefined ? type : tabKey,
        userId
      },
      page: page || 1,
      limit: 5,
      orderBy: (sort !== undefined ? sort : listSort)
        ? [
          ['viewCount', 'desc'],
          ['id', 'desc']
        ]
        : [['id', 'desc']]
    });
  };

  // 文章数
  const queryListTotal = () => {
    request(serviceApi.getUserArticleTotal, {
      params: {
        id: userId
      }
    }).then((res) => {
      setArticleTotal(res?.data);
    });
  };

  // 文章切换类型
  const onTabChange = (key) => {
    queryList({
      type: key
    }).then((res) => {
      setListData(res?.data?.list || []);
    });
    setPage(1);
    setIsNoData(false);
    setTabKey(key);
  };

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

  // 关注/取消关注
  const follow = (id) => {
    request(serviceApi.setFollow, {
      method: 'get',
      params: {
        id
      }
    }).then((res) => {
      if (res && res.code === 200) {
        message.success(res.msg);
        setFollowStatus(res.status);
      }
    });
  };

  // 查询用户信息
  const getUserInfo = (callback) => {
    request(serviceApi.getUserInfo, {
      params: {
        id: userId
      }
    }).then((res) => {
      if (res && res.code === 200) {
        setUserInfo(res.data);
        // 有回调则回调
        callback && callback(res.data);
        if (res.data.status && res.data.status === 1) {
          setFollowStatus(true);
        }
      }
    });
  };

  // 更新用户信息方法
  const updateUserInfo = (params) => {
    request(serviceApi.updateUserInfo, {
      method: 'post',
      data: params
    }).then((res) => {
      if (res.code == 200) {
        getUserInfo((res) => {
          let userInfo = Cookies.getJSON('userInfo');
          userInfo = Object.assign(userInfo, res);
          Cookies.set('userInfo', userInfo, {
            expires: userInfo.cookiesCreateAt
          });
          props.userInfoChange(userInfo);
        });
        message.success('操作成功！');
      }
    });
  };

  // tabActive 改变事件 ， 约定魔术变量 1=> 文章 ；2=> 关注 ；3=> 粉丝
  const tabActiveChange = (key) => {
    setTabActive(key);
    // 三个数据同一个容器变量装，需要清空再赋值
    setListData([]);
    setPage(1);
    setIsNoData(false);

    if (key === 1) {
      setTabKey(_.get(dict, 'articleType.all'));
      queryList({
        type: _.get(dict, 'articleType.all')
      }).then((res) => {
        setListData(res?.data?.list || []);
      });
    }

    if (key === 2) {
      baseQueryList(serviceApi.getFollowList, {
        filters: {
          id: userId
        },
        limit: fansLimit
      }).then((res) => {
        setListData(res?.data?.list || []);
      });
    }

    if (key === 3) {
      baseQueryList(serviceApi.getFansList, {
        filters: {
          id: userId
        },
        limit: fansLimit
      }).then((res) => {
        setListData(res?.data?.list || []);
      });
    }
  };

  // 已登陆状态下 判断是自己还是别人
  const isOwn = () => {
    if (loginUserInfo && userInfo && loginUserInfo.userId === userInfo.id) {
      return true;
    }
    return false;
  };

  const fansLoadMore = () => {
    let api = tabKey === 2 ? serviceApi.getFollowList : serviceApi.getFansList;
    baseQueryList(api, {
      filters: {
        id: userId
      },
      limit: fansLimit,
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

  // 文章列表渲染
  const renderActive = () => {
    return (
      <>
        {userInfo.auth * 1 !== _.get(dict, 'auth.user') ? (
          <Card
            className={styles['tabs-card']}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={onTabChange}
            tabBarExtraContent={<ArticleSort onChange={listSortFn} />}
          >
            <ArticleList
              loadMore={loadMore}
              isNoData={isNoData}
              isEdit={isOwn()}
              loading={props.getUserArticleListLoading}
              data={listData}
              callBack={() => {
                queryList({tabKey}).then((res) => {
                  setListData(res?.data?.list || []);
                  queryListTotal();
                });
                setPage(1);
                setIsNoData(false);
              }}
            />
          </Card>
        ) : (
          <Card bordered={false}>
            {isOwn() ? (
              <div className={'ant-list-empty-text'}>
                ㄟ( ▔, ▔ )ㄏ 你还不是博主哦, 联系挺哥申请吧！
              </div>
            ) : (
              <div className={'ant-list-empty-text'}>
                ㄟ( ▔, ▔ )ㄏ 该用户不是博主，没有发表过文章！
              </div>
            )}
          </Card>
        )}
      </>
    );
  };

  // 关注列表渲染/粉丝列表渲染
  const renderFollow = () => {
    let loading = props.getFollowListLoading || props.getFansListLoading;
    return (
      <Spin spinning={loading}>
        <Card bordered={false}>
          <Row gutter={20}>
            {!_.isEmpty(listData) ? (
              _.map(listData, (item) => {
                return (
                  <Col xs={24} xm={12} lm={12} lg={12} key={item.id}>
                    <Link
                      replace
                      href="/userCenter/[id]"
                      as={`/userCenter/${item.id}`}
                    >
                      <a target="_blank">
                        <Card
                          bodyStyle={{ padding: 20 }}
                          className={styles['user-list']}
                          bordered={false}
                        >
                          <Meta
                            avatar={<Avatar size={60} src={item.avatar} />}
                            title={item.userName}
                            description={item.autograph}
                          />
                        </Card>
                      </a>
                    </Link>
                  </Col>
                );
              })
            ) : (
              <div className={'ant-list-empty-text'}>ㄟ( ▔, ▔ )ㄏ 暂无数据</div>
            )}
          </Row>
          <div>
            {
              listData?.length >= (fansLimit * page) ? (
                !isNoData ? (
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Button
                      loading={loading}
                      onClick={() => fansLoadMore()}
                    >
                       加载更多
                    </Button>
                  </div>
                ) : null
              ) : null
            }
          </div>


        </Card>
      </Spin>
    );
  };

  return (
    <>
      <Head>
        <title>挺哥博客-个人中心</title>
      </Head>

      <>
        <div className={styles['user-bg']}>
          {userInfo ? (
            <LazyImg background params="?imageslim" src={userInfo?.cover}>
              {/* 区分是否用户本人登录了 */}
              {isOwn() ? (
                <div className={styles['edit-cover']}>
                  <div >
                    <FileUploader
                      className={styles['avatar-uploader']}
                      mode="avatar"
                      accept=".jpg,.png,.jpeg,.gif"
                      maxSize={1024 * 1024 * 10}
                      cropOption={{
                        aspect: 1200 / 200
                      }}
                      onChange={(value) =>
                        updateUserInfo({ cover: value })
                      }
                    >
                      修改封面
                    </FileUploader>
                  </div>
                </div>
              ) : null}
            </LazyImg>
          ) : null}
        </div>

        <Row className={styles['user-center-page']}>
          <Col lg={6} md={6} className={styles['user-card']}>
            {/* up信息列表 */}
            <Card
              bordered={false}
              className={classNames(styles['user-info'], {
                [styles['hide-active']]: !settingStatus
              })}
            >
              <div>

                {!isOwn() && loginUserInfo && loginUserInfo?.userId !== userId ? (
                  <div className={styles['btn-box']}>
                    <Button
                      icon={<HeartOutlined />}
                      onClick={() => follow(userInfo.id)}
                      className={classNames(styles['btn'], styles['follow-btn'], {
                        [styles['active']]: followStatus
                      })}
                    >
                      {followStatus ? '已粉' : '关注'}
                    </Button>
                  </div>
                ) : null}

                {isOwn() ? (
                  <div className={styles['btn-box']}>
                    <Button
                      icon={
                        <SvgIcon
                          name={settingStatus ? 'iconshezhi-copy' : 'iconshezhi'}
                        />
                      }
                      onClick={() => setSettingStatus(!settingStatus)}
                      className={classNames(styles['btn'], styles['follow-btn'], {
                        [styles['active']]: settingStatus
                      })}
                    >
                      {settingStatus ? '完成' : '修改'}
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className={styles['avatar-holder']}>
                {props.uploadQiniuLoading ? (
                  <Spin size="large" className={styles['update-loading']} />
                ) : null}

                {userInfo ? (
                  <Avatar
                    size={100}
                    src={userInfo.avatar}
                    style={{ color: '#fff', backgroundColor: '#fff' }}
                  >
                    {userInfo.userName}
                  </Avatar>
                ) : null}

                <FileUploader
                  className={styles['avatar-uploader']}
                  mode="children"
                  accept=".jpg,.png,.jpeg,.gif"
                  maxSize={1024 * 1024 * 10}
                  disabled={props.uploadQiniuLoading || !settingStatus}
                  cropOption={{
                    aspect: 100 / 100
                  }}
                  onChange={(value) =>
                    updateUserInfo({ avatar: value })
                  }
                >
                  {settingStatus && !props.uploadQiniuLoading ? (
                    <span>
                      <CloudUploadOutlined style={{ marginRight: 5 }} />
                      更改头像
                    </span>
                  ) : null}
                </FileUploader>
              </div>

              <div className={styles['detail']}>
                <div className={styles['base-info']}>
                  <div style={{ textAlign: 'center' }}>
                    <Paragraph
                      className={styles['name']}
                      editable={{
                        icon: <SvgIcon name="iconedit" />,
                        onChange: (value) =>
                          updateUserInfo({ userName: value })
                      }}
                    >
                      {userInfo.userName}
                    </Paragraph>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <Paragraph
                      className={styles['autograph']}
                      editable={{
                        icon: <SvgIcon name="iconedit" />,
                        onChange: (value) =>
                          updateUserInfo({ autograph: value })
                      }}
                    >
                      {userInfo?.autograph}
                    </Paragraph>
                  </div>

                  {settingStatus || userInfo?.post ? (
                    <div className={styles['user-option']}>
                      <SvgIcon name="iconbangong-copy" />
                      <Paragraph
                        editable={{
                          icon: <SvgIcon name="iconedit" />,
                          onChange: (value) => updateUserInfo({ post: value })
                        }}
                      >
                        {userInfo?.post}
                      </Paragraph>
                    </div>
                  ) : null}

                  {settingStatus || userInfo?.address ? (
                    <div className={styles['user-option']}>
                      <SvgIcon name="icondingwei-copy" />
                      <i className={styles['group']} />
                      <Paragraph
                        editable={{
                          icon: <SvgIcon name="iconedit" />,
                          onChange: (value) =>
                            updateUserInfo({ address: value })
                        }}
                      >
                        {userInfo?.address}
                      </Paragraph>
                    </div>
                  ) : null}

                  {settingStatus || userInfo?.tags ? (
                    <div className={classNames(styles['user-option'], styles['tags'])}>
                      <SvgIcon name="iconbiaoqian-copy" />
                      <span style={{ flex: 1, width: 0 }}>
                        <TagsAdd
                          isEdit={settingStatus}
                          value={userInfo?.tags}
                          onChange={(value) => updateUserInfo({ tags: value })}
                        />
                      </span>
                    </div>
                  ) : null}
                </div>

                {settingStatus || !_.isEmpty(userInfo?.contact) ? (
                  <div style={{ marginBottom: 40 }}>
                    <Divider>联系方式</Divider>
                    <div>
                      <Contact
                        value={userInfo?.contact}
                        isEdit={settingStatus}
                        onChange={(value) => updateUserInfo({ contact: value })}
                      />
                    </div>
                  </div>
                ) : null}

                {settingStatus || !_.isEmpty(userInfo?.rewardCode) ? (
                  <div style={{ marginBottom: 40 }}>
                    <div className={styles['tags-title']}>赞赏码</div>
                    <div>
                      <Rewards
                        value={userInfo?.rewardCode}
                        isEdit={settingStatus}
                        onChange={(value) =>
                          updateUserInfo({ rewardCode: value })
                        }
                      />
                    </div>
                  </div>
                ) : null}

                {/* 歌单和账号密码 只能个人看到 */}
                {loginUserInfo?.userId === userId ? (
                  <div style={{ marginBottom: 40 }}>
                    <div className={styles['tags-title']}>
                      网易云歌单
                      <Tooltip
                        placement="top"
                        title="根据歌单id，设置左下角播放器为你喜欢的歌单。默认:705619441"
                      >
                        <QuestionCircleOutlined
                          style={{ marginLeft: 5, cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </div>
                    <p>
                      <SvgIcon name="iconyinle" style={{ marginRight: 10 }} />
                      <span className={styles['tags-content']}>
                        {loginUserInfo && loginUserInfo.songsId}
                      </span>
                      {settingStatus ? (
                        <Button
                          size="small"
                          style={{ marginLeft: 20 }}
                          type="primary"
                          onClick={() => setSongsModalVisible(true)}
                        >
                          更改歌单
                        </Button>
                      ) : null}
                    </p>

                    <Divider dashed />

                    <div className={styles['tags-title']}>账号</div>
                    <p>
                      <SvgIcon name="iconwode" style={{ marginRight: 10 }} />
                      {loginUserInfo?.mobile ? (
                        <span className={styles['tags-content']}>
                          {loginUserInfo.mobile}
                        </span>
                      ) : (
                        <span className={styles['tags-content']}>未绑定</span>
                      )}

                      {settingStatus ? (
                        <Button
                          size="small"
                          style={{ marginLeft: 20 }}
                          type="primary"
                          onClick={() => setMobileModalVisible(true)}
                        >
                          绑定手机
                        </Button>
                      ) : null}
                    </p>

                    <div className={styles['tags-title']}>密码</div>
                    <p>
                      <SvgIcon name="iconmima" style={{ marginRight: 10 }} />
                      <span className={styles['tags-content']}>******</span>
                      {settingStatus ? (
                        <Button
                          size="small"
                          style={{ marginLeft: 20 }}
                          type="primary"
                          onClick={() => setModalVisible(true)}
                        >
                          更改密码
                        </Button>
                      ) : null}
                    </p>

                    <BindMobileForm
                      modalVisible={mobileModalVisible}
                      setModalVisible={setMobileModalVisible}
                      initialValue={loginUserInfo.mobile}
                      confirmLoading={props.updateMobileLoading}
                      userInfoChange={props.userInfoChange}
                    />

                    <EditSongsForm
                      modalVisible={songsModalVisible}
                      setModalVisible={setSongsModalVisible}
                      initialValue={loginUserInfo.songsId}
                      confirmLoading={props.updateSongsLoading}
                      getUserInfo={getUserInfo}
                      userInfoChange={props.userInfoChange}
                    />

                    <EditPasswordForm
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                      confirmLoading={props.updatePasswordLoading}
                    />
                  </div>
                ) : null}
              </div>
            </Card>
          </Col>

          <Col className={styles['right-box']} lg={18} md={18}>
            <Card
              className={styles['tab-box']}
              bordered={false}
              style={{ textAlign: 'center' }}
            >
              <span
                className={tabActive === 1 ? styles['active'] : null}
                onClick={() => tabActiveChange(1)}
              >
                {isOwn()
                  ? '我'
                  : 'Ta'}
                的文章
              </span>
              <span
                className={tabActive === 2 ? styles['active'] : null}
                onClick={() => tabActiveChange(2)}
              >
                {isOwn()
                  ? '我'
                  : 'Ta'}
                的关注
              </span>
              <span
                className={tabActive === 3 ? styles['active'] : null}
                onClick={() => tabActiveChange(3)}
              >
                {isOwn()
                  ? '我'
                  : 'Ta'}
                的粉丝
              </span>
            </Card>
            <div className={classNames(styles['list-nav'])}>
              {tabActive === 1 ? renderActive() : renderFollow()}
            </div>
          </Col>
        </Row>
      </>
    </>
  );
};

export async function getServerSideProps (context) {
  if (!context.query.id) {
    return {};
  }

  // 查询用户信息
  const userInfoPromise = new Promise((resolve) => {
    request(serviceApi.getUserInfo, {
      params: {
        id: context.query.id
      },
      headers: {
        Cookie: context.req?.headers?.cookie
      }
    }).then((res) => {
      resolve(res?.data);
    });
  });

  // 文章请求 需要传Cookie给后台判断 是否登陆 是否超管 是否自己
  // 获取自己发的文件数量统计
  const userArticleTotal = new Promise((resolve) => {
    request(serviceApi.getUserArticleTotal, {
      params: {
        id: context.query.id
      },
      headers: {
        Cookie: context.req?.headers?.cookie
      }
    }).then((res) => {
      resolve(res?.data);
    });
  });

  // 文章列表
  const userArticleListPromise = new Promise((resolve) => {
    baseQueryList(serviceApi.getArticleList, {
      filters: {
        userId: context.query.id
      },
      limit: 5,
      // 文章请求 需要传Cookie给后台判断 是否登陆 是否超管 是否自己
      requestProps: {
        headers: {
          Cookie: context.req?.headers?.cookie
        }
      }
    }).then((res) => {
      resolve(res?.data?.list || []);
    });
  });

  let userInfoData = await userInfoPromise;
  let articleTotalData = await userArticleTotal;
  let userArticleList = await userArticleListPromise;

  return { props: { userInfoData, articleTotalData, userArticleList } };
}

const stateToProps = (state) => {
  return {
    loginUserInfo: state.userInfo,
    updateUserInfoLoading: state.updateUserInfoLoading,
    updatePasswordLoading: state.updatePasswordLoading,
    updateMobileLoading: state.updateMobileLoading,
    updateSongsLoading: state.updateSongsLoading,
    getUserArticleListLoading: state.getUserArticleListLoading,
    getFollowListLoading: state.getFollowListLoading,
    getFansListLoading: state.getFansListLoading,
    uploadQiniuLoading: state.getQiniuTokenLoading || state.uploadQiniuLoading
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

const CenterForm = connect(
  stateToProps,
  dispatchToProps
)(withRouter(UserCenter));
export default CenterForm;

