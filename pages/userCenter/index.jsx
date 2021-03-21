/*
 * @Author: TingGe
 * @Date: 2021-01-24 16:53:10
 * @LastEditTime: 2021-02-06 09:51:12
 * @LastEditors: TingGe
 * @Description: 个人中心
 * @FilePath: /ting_ge_blog/pages/userCenter/index.jsx
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import Router, { withRouter } from 'next/router'
import Link from 'next/link'
import { Row, Col, Card, Button, message, Upload, Form, Input, Modal, Avatar, Divider, Typography, Spin, Tooltip, Radio } from 'antd'
import classnames from 'classnames'
import store, { set } from 'store'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import ArticeList from '@/components/ArticeList'
import LazyImg from '@/components/LazyImg'
import TagsAdd from '@/components/TagsAdd'
import Contact from '@/components/Contact'
import Rewards from '@/components/Rewards'
import { connect } from 'react-redux'
import { uploadQiniu } from '@/public/utils/uploadQiniu'
import {
  SwapOutlined,
  SettingOutlined,
  CloudUploadOutlined,
  TagsOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  MobileOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';
import './style.less'

const { Paragraph } = Typography;
const FormItem = Form.Item;
const { Meta } = Card

const UserCenter = (props) => {
  const [form] = Form.useForm();

  const [userInfo, setUserInfo] = useState(props.userInfoData)
  const [articleTotal, setArticleTotal] = useState(props.articleTotalData)
  const [tabKey, setTabKey] = useState('0')
  const [tabActive, setTabActive] = useState(1)

  const [listData, setListData] = useState(props.userArticleList)
  const [followStatus, setFollowStatus] = useState(false)
  const [settingStatus, setSettingStatus] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [mobileModalVisible, setMobileModalVisible] = useState(false)
  const [songsModalVisible, setSongsModalVisible] = useState(false)


  // 页数
  const [page, setPage] = useState(1)
  const [isNoData, setIsNoData] = useState(false)
  const [listSort, setListSort] = useState(true)

  const operationTabList = [
    {
      key: '0',
      tab: (
        <span>
          全部 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.js + articleTotal.sy + articleTotal.shh})</span>
        </span>
      ),
    },
    {
      key: '1',
      tab: (
        <span>
          技术 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.js})</span>
        </span>
      ),
    },
    {
      key: '2',
      tab: (
        <span>
          摄影 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.sy})</span>
        </span>
      ),
    },
    {
      key: '3',
      tab: (
        <span>
          生活 <span style={{ fontSize: 14 }}>({articleTotal && articleTotal.shh})</span>
        </span>
      ),
    }
  ];

  /**
  * 查询列表方法
  * @description: 公用查询列表方法
  * @param { type page limit listSort }
  * @return: 文章列表
  */
  const queryLsit = (tabKey, page, limit, listSort) => {
    return new Promise((resolve, reject) => {
      request(serviceApi.getUserArticleList, {
        method: 'get',
        params: {
          id: props.router.query.id,
          type: tabKey === '0' ? null : tabKey,
          page: page,
          limit: limit,
          sort: listSort ? 0 : 1
        }
      }).then((res) => {
        resolve(res)
      })
    })
  }


  // 切换类型
  const onTabChange = (key) => {
    setTabKey(key)
    setPage(1)
    setIsNoData(false)

    queryLsit(key, 1, 5, listSort).then(res => {
      setListData(res.data)
    })
  }

  // 切换排序
  const listSortFn = () => {
    queryLsit(tabKey, 1, 5, !listSort).then((res) => {
      setListData(res.data)
    })

    setListSort(!listSort)
    setPage(1)
  }

  // 加载更多
  const loadMore = () => {
    setPage(page + 1)

    queryLsit(tabKey, page + 1, 5, listSort).then((res) => {
      if (!res.data.length) {
        setIsNoData(true)
        return
      }

      setListData([].concat(listData, res.data))
    })
  }

  // 关注/取消关注
  const follow = (id) => {
    request(serviceApi.setFollow, {
      method: 'get',
      params: {
        id
      }
    }).then((res) => {
      if (res && res.code == 200) {
        message.success(res.msg)
        setFollowStatus(res.status)
      }
    })
  }

  // 查询用户信息
  const getUserInfo = (callback) => {
    request(serviceApi.getUserInfo, {
      method: 'get',
      params: {
        id: props.router.query.id,
      }
    }).then((res) => {
      if (res && res.code == 200) {
        setUserInfo(res.data)

        // 有回调则回调
        callback && callback(res.data)

        if (res.data.status && res.data.status === '0') {
          setFollowStatus(true)
        }
      }
    })
  }

  //上传图片,特意留个gif格式. 头像就是要gif才好玩
  const handleImgBeforeUpload = (file, fileList, callback) => {
    if (file.type) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png';
      if (!isJPG) {
        message.error('只支持jpg、png、gif格式,请重新选择');
        return false;
      }
    } else {
      //大小写转换用名称进行判断
      let imgName = file.name ? file.name.toLowerCase() : '';
      if (!(imgName === 'jpg' || file.type === 'gif' || imgName === 'png')) {
        message.error('只支持jpg、png格式,请重新选择');
        return false;
      }
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小大于2M，请重新选择');
      return false;
    }
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener('load', res => {
      callback(file);
    });
    return false;
  };


  //上传头像图片方法
  const changeupload = (file) => {
    uploadQiniu(file, (res) => {
      updateUserInfo({ avatar: res })
    })
  };

  //上传用户封面图片方法
  const changeuploadCover = (file) => {
    uploadQiniu(file, (res) => {
      updateUserInfo({ cover: res })
    })
  };

  // 更新用户信息方法 {url: xxx}
  const updateUserInfo = (params) => {
    request(serviceApi.updateUserInfo, {
      method: 'post',
      data: params
    }).then((res) => {
      if (res.code == 200) {
        getUserInfo((res) => {
          let userInfo = store.get('userInfo')
          userInfo = Object.assign(userInfo, res)
          store.set('userInfo', userInfo)
          props.userInfoChange(userInfo)
        })
        message.success('操作成功！')
      }
    })
  }

  const userNameChange = str => {
    updateUserInfo({ userName: str })
  };

  const autographChange = str => {
    updateUserInfo({ autograph: str })
  }

  const postChange = str => {
    updateUserInfo({ post: str })
  }
  const addressChange = str => {
    updateUserInfo({ address: str })
  }

  // 添加标签组件 改变回调
  const tagsChangeCallback = (value) => {
    let str = value.join();
    updateUserInfo({ tags: str })
  }

  // 修改密码
  const handleEditPwd = () => {
    form.validateFields().then((fieldsValue) => {
      request(serviceApi.updatePassword, {
        method: 'post',
        data: fieldsValue
      }).then(res => {
        if (res.code == 200) {
          message.success(res.msg)
          localStorage.setItem('userInfo', null)
          Router.replace({
            pathname: '/index',
          })
        }
      })
    }).catch((info) => {
      console.log('验证失败:', info);
    });

  }

  // tabActive 改变事件 1=> 文章 ；2=> 关注 ；3=> 粉丝
  const tabActiveChange = (key) => {
    setTabActive(key);

    // 三个数据同一个容器变量装，需要清空再赋值
    setListData([])

    if (key == 1) {
      setTabKey('0')

      request(serviceApi.getUserArticleList, {
        method: 'get',
        params: {
          id: props.router.query.id,
          type: null,
          page: 1,
          limit: 5,
          sort: 0
        }
      }).then((res) => {
        setListData(res.data)
      })
    }

    if (key == 2) {
      request(serviceApi.getFollowList, {
        method: 'get',
        params: {
          id: props.router.query.id
        }
      }).then((res) => {
        setListData(res.data)
      })
    }

    if (key == 3) {
      request(serviceApi.getFansList, {
        method: 'get',
        params: {
          id: props.router.query.id,
          page: 1,
          limit: 5,
        }
      }).then((res) => {
        setListData(res.data)
      })
    }
  }

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

  return (
    <>
      <Head>
        <title>挺哥博客-个人中心</title>
      </Head>

      <>
        <div className="user-bg">

          <If condition={userInfo}>
            <LazyImg background={true} params="?imageslim" src={userInfo.cover}>
              {/* 区分是否用户本人登录了 */}
              <If condition={props.loginUserInfo && ~~props.loginUserInfo.userId === ~~props.router.query.id}>
                <div className="edit-cover">
                  <Upload
                    name="avatar"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file, fileList) => handleImgBeforeUpload(file, fileList, changeuploadCover)}
                    disabled={props.uploadQiniuLoading}
                    accept="image/*"
                  >
                    修改封面
                    </Upload>
                </div>
              </If>
            </LazyImg>
          </If>
        </div>

        <Row className="user-center-page">

          <Col lg={6} md={6} id="user-card">
            {/* up信息列表 */}
            <Card
              bordered={false}
              className={classnames("user-info", { "hide-active": !settingStatus })}
            >
              <If condition={props.loginUserInfo && props.loginUserInfo.userId != props.router.query.id} >
                <div className="btn-box">
                  <Button icon={<HeartOutlined />} onClick={() => follow(userInfo.userId)}
                    className={
                      classnames('btn', 'follow-btn', {
                        'active': followStatus
                      })
                    }
                  >{followStatus ? '已粉' : '关注'}</Button>
                </div>
              </If>

              <If condition={props.loginUserInfo && props.loginUserInfo && ~~props.loginUserInfo.userId === ~~props.router.query.id} >
                <div className="btn-box">
                  <Button icon={<SettingOutlined />} onClick={() => setSettingStatus(!settingStatus)}
                    className={
                      classnames('btn', 'follow-btn', {
                        'active': settingStatus
                      })
                    }
                  >{settingStatus ? '完成' : '修改'}</Button>
                </div>
              </If>

              <div className="avatar-holder">
                <If condition={props.uploadQiniuLoading}>
                  <Spin size="large" className="update-loading" />
                </If>

                <If condition={userInfo}>
                  <Avatar size={100} src={userInfo.avatar} style={{ color: '#fff', backgroundColor: '#fff' }}>
                    {userInfo.userName}
                  </Avatar>
                </If>

                <Upload
                  name="avatar"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file, fileList) => handleImgBeforeUpload(file, fileList, changeupload)}
                  disabled={props.uploadQiniuLoading || !settingStatus}
                  accept="image/*"
                >
                  <If condition={settingStatus && !props.uploadQiniuLoading}>
                    <CloudUploadOutlined style={{ marginRight: 5 }} />
                      更改头像
                  </If>
                </Upload>
              </div>

              <div className="detail">
                <div style={{ textAlign: 'center' }}>
                  <Paragraph className="name" editable={{ onChange: userNameChange }}>{userInfo ? userInfo.userName : ''}</Paragraph>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Paragraph className="autograph" editable={{ onChange: autographChange }}>{userInfo ? userInfo.autograph : ''}</Paragraph>
                </div>

                <div className="user-option">
                  <ToolOutlined />
                  <Paragraph editable={{ onChange: postChange }}>{userInfo ? userInfo.post : ''}</Paragraph>
                </div>

                <div className="user-option">
                  <EnvironmentOutlined />
                  <i className="group" />
                  <Paragraph editable={{ onChange: addressChange }}>{userInfo ? userInfo.address : ''}</Paragraph>
                </div>

                <div className={classnames("user-option", "tags")}>
                  <TagsOutlined />
                  <TagsAdd isEdit={settingStatus} data={userInfo && userInfo.tags ? userInfo.tags : []} callback={tagsChangeCallback} />
                </div>

                <div style={{ marginBottom: 40 }}>
                  <Divider>联系方式</Divider>
                  <div>
                    <Contact userInfo={userInfo} isEdit={settingStatus} callback={getUserInfo} />
                  </div>
                </div>

                <div style={{ marginBottom: 40 }}>
                  <div className="tags-title">赞赏码</div>
                  <div>
                    <Rewards userInfo={userInfo} isEdit={settingStatus} callback={getUserInfo} />
                  </div>
                </div>

                {/* 歌单和账号密码 只能个人看到 */}
                <If condition={props.loginUserInfo && ~~props.loginUserInfo.userId === ~~props.router.query.id}>
                  <div style={{ marginBottom: 40 }}>
                    <div className="tags-title">网易云歌单
                     <Tooltip placement="top" title="根据歌单id，设置左下角播放器为你喜欢的歌单。默认:705619441">
                        <QuestionCircleOutlined style={{ marginLeft: 5, cursor: 'pointer' }} />
                      </Tooltip>
                    </div>
                    <p>
                      <CustomerServiceOutlined style={{ marginRight: 10 }} />
                      <span style={{ color: '#999' }}>{props.loginUserInfo && props.loginUserInfo.songsId}</span>
                      <If condition={settingStatus}>
                        <Button size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => setSongsModalVisible(true)}>
                          更改歌单
                        </Button>
                      </If>
                    </p>

                    <Divider dashed />

                    <div className="tags-title">账号</div>
                    <p>
                      <MobileOutlined style={{ marginRight: 10 }} />
                      <Choose>
                        <When condition={props.loginUserInfo.mobile}>
                          <span style={{ color: '#999' }}>{props.loginUserInfo.mobile}</span>
                        </When>
                        <Otherwise>
                          <span style={{ color: '#999' }}>未绑定</span>
                        </Otherwise>
                      </Choose>
                      <If condition={settingStatus}>
                        <Button size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => setMobileModalVisible(true)}>
                          绑定手机
                        </Button>
                      </If>
                    </p>

                    <div className="tags-title">密码</div>
                    <p>
                      <LockOutlined style={{ marginRight: 10 }} />
                      <span style={{ color: '#999' }}>******</span>
                      <If condition={settingStatus}>
                        <Button size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => setModalVisible(true)}>
                          更改密码
                        </Button>
                      </If>
                    </p>

                    <BindMobieForm
                      modalVisible={mobileModalVisible}
                      setModalVisible={setMobileModalVisible}
                      initialValue={props.loginUserInfo.mobile}
                      confirmLoading={props.updateMobileLoading}
                      userInfoChange={props.userInfoChange}
                    />

                    <EditSongsForm
                      modalVisible={songsModalVisible}
                      setModalVisible={setSongsModalVisible}
                      initialValue={props.loginUserInfo.songsId}
                      confirmLoading={props.updateSongsLoading}
                      getUserInfo={getUserInfo}
                      userInfoChange={props.userInfoChange}
                    />

                    <Modal
                      title="更改密码"
                      width={500}
                      destroyOnClose
                      visible={modalVisible}
                      okText="保存"
                      onOk={handleEditPwd}
                      onCancel={() => { setModalVisible(false); form.resetFields() }}
                      maskClosable={false}
                      confirmLoading={props.updatePasswordLoading}
                    >
                      <Form
                        form={form}
                        name="editPwd"
                        initialValues={{
                          oldPassword: '',
                          newPassword: ''
                        }}
                        onFinish={handleEditPwd}
                      >
                        <FormItem {...formLayout}
                          label="旧密码"
                          name="oldPassword"
                          rules={[{ required: true, message: '旧密码不能为空！' }]}
                        >
                          <Input.Password placeholder="请输入旧密码" />
                        </FormItem>
                        <FormItem {...formLayout}
                          label="新密码"
                          name="newPassword"
                          rules={[
                            { required: true, message: '新密码不能为空！' },
                            { message: '密码长度应为6~20位之间', min: 6, max: 20 }
                          ]}
                        >
                          <Input.Password placeholder="请输入新密码（6~20位）" />
                        </FormItem>
                      </Form>
                    </Modal>
                  </div>

                </If>
              </div>

            </Card>
          </Col>

          <Col id='right-box' lg={18} md={18}>
            <Card className="tab-box" bordered={false} style={{ textAlign: 'center' }}>
              <span className={tabActive == 1 ? 'active' : null} onClick={() => tabActiveChange(1)}>{props.loginUserInfo && userInfo && ~~props.loginUserInfo.userId == ~~userInfo.userId ? '我' : 'Ta'}的文章</span>
              <span className={tabActive == 2 ? 'active' : null} onClick={() => tabActiveChange(2)}>{props.loginUserInfo && userInfo && ~~props.loginUserInfo.userId == ~~userInfo.userId ? '我' : 'Ta'}的关注</span>
              <span className={tabActive == 3 ? 'active' : null} onClick={() => tabActiveChange(3)}>{props.loginUserInfo && userInfo && ~~props.loginUserInfo.userId == ~~userInfo.userId ? '我' : 'Ta'}的粉丝</span>
            </Card>

            <div className={classnames('list-nav')}>

              <If condition={tabActive === 1}>
                <Choose>
                  <When condition={userInfo && ~~userInfo.auth >= 1}>
                    <Card
                      className="tabs-card"
                      bordered={false}
                      tabList={operationTabList}
                      activeTabKey={tabKey}
                      onTabChange={onTabChange}
                      tabBarExtraContent={
                        <span onClick={listSortFn} className="switch-btn">
                          <SwapOutlined style={{ color: '#1890ff', marginRight: 10 }} />
                          切换为{listSort ? '热门排序' : '时间排序'}
                        </span>
                      }
                    >
                      <ArticeList
                        loadMore={loadMore}
                        isNoData={isNoData}
                        loading={props.getUserArticleListLoading}
                        data={listData}
                      />
                    </Card>
                  </When>
                  <Otherwise>
                    <Card bordered={false}>
                      {
                        props.loginUserInfo && userInfo && ~~props.loginUserInfo.auth == ~~userInfo.auth ?
                          <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 你还不是博主哦, 联系挺哥申请吧！</div>
                          :
                          <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 该用户不是博主，没有发表过文章！</div>
                      }
                    </Card>
                  </Otherwise>
                </Choose>
              </If>


              <If condition={tabActive === 2}>
                <Spin spinning={props.getFollowListLoading}>
                  <Card bordered={false}>
                    <Row gutter={20}>
                      <Choose>
                        <When condition={listData && listData.length}>
                          <For each="item" of={listData}>
                            <Col xs={24} xm={12} lm={12} lg={12} key={index}>
                              <Link replace href={{ pathname: '/userCenter', query: { id: item.id } }}>
                                <a target="_blank">
                                  <Card bodyStyle={{ padding: 20 }} className="user-list" bordered={false}>
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
                          </For>
                        </When>
                        <Otherwise>
                          <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 暂无数据</div>
                        </Otherwise>
                      </Choose>
                    </Row>
                  </Card>
                </Spin>
              </If>

              <If condition={tabActive === 3}>
                <Spin spinning={props.getFansListLoading}>
                  <Card bordered={false} >
                    <Row gutter={20}>
                      <Choose>
                        <When condition={listData && listData.length}>
                          <For each="item" of={listData}>
                            <Col xs={24} xm={12} lm={12} lg={12} key={index}>
                              <Link replace href={{ pathname: '/userCenter', query: { id: item.id } }}>
                                <a target="_blank">
                                  <Card bodyStyle={{ padding: 20 }} className="user-list" bordered={false}>
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
                          </For>
                        </When>
                        <Otherwise>
                          <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 暂无数据</div>
                        </Otherwise>
                      </Choose>
                    </Row>
                  </Card>
                </Spin>
              </If>
            </div>
          </Col>
        </Row>
      </>
    </>
  )
}

export async function getServerSideProps(context) {

  if (!context.query.id) { return {} }

  // 查询用户信息
  const promise1 = new Promise((resolve) => {
    request(serviceApi.getUserInfo, {
      method: 'get',
      params: {
        id: context.query.id
      }
    }).then((res) => {
      resolve(res.data)
    })
  })

  // 获取自己发的文件数量 统计， 此接口用的少 服务端拿问题不大
  const promise2 = new Promise((resolve) => {
    request(serviceApi.getUserArticleTotal, {
      method: 'get',
      params: {
        id: context.query.id
      }
    }).then((res) => {
      resolve(res.data)
    })
  })

  // 文章列表
  const promise3 = new Promise((resolve) => {
    request(serviceApi.getUserArticleList, {
      method: 'get',
      params: {
        id: context.query.id,
        type: null,
        page: 1,
        limit: 5,
        sort: 0
      }
    }).then((res) => {
      resolve(res.data)
    })
  })

  let userInfoData = await promise1
  let articleTotalData = await promise2
  let userArticleList = await promise3

  return { props: { userInfoData, articleTotalData, userArticleList } }
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

const CenterForm = connect(stateToProps, dispatchToProps)(withRouter(UserCenter))
export default CenterForm


// 绑定手机form组件
const BindMobieForm = (props) => {
  const [form] = Form.useForm();

  const handleEditMobile = () => {
    form.validateFields().then((fieldsValue) => {
      request(serviceApi.updateMobile, {
        method: 'post',
        data: fieldsValue
      }).then(res => {
        if (res.code == 200) {
          message.success(res.msg)
          props.userInfoChange(null);
          localStorage.setItem('userInfo', null)
          Router.replace({
            pathname: '/index',
          })
        }
      })
    }).catch((info) => {
      console.log('验证失败:', info);
    });
  }

  return (
    <Modal
      title="绑定手机"
      width={300}
      destroyOnClose
      visible={props.modalVisible}
      okText="保存"
      onOk={handleEditMobile}
      onCancel={() => { props.setModalVisible(false); form.resetFields() }}
      maskClosable={false}
      confirmLoading={props.confirmLoading}
    >
      <Form
        form={form}
        name="bindMobie"
        initialValues={{
          mobile: props.initialValue,
        }}
        onFinish={handleEditMobile}
      >
        <FormItem label="手机号" name="mobile" rules={[
          { required: true, message: '手机号不能为空' },
          { message: '手机号不正确', pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g") },
        ]}>
          <Input placeholder="请输入要绑定的手机号"
            suffix={
              <Tooltip title="绑定的手机号将作为登录账号。第一次绑定的初始密码为123456，后面更换绑定不重置，密码不可逆，请妥善保管！">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            } />
        </FormItem>
      </Form>
    </Modal>
  )
};



// 更改网易云歌单id组件
const EditSongsForm = (props) => {
  const [form] = Form.useForm();

  const handleEditSongs = () => {
    form.validateFields().then((fieldsValue) => {
      request(serviceApi.updateSongs, {
        method: 'post',
        data: fieldsValue
      }).then(res => {
        if (res.code == 200) {
          message.success(res.msg)
          props.getUserInfo((res) => {
            let userInfo = store.get('userInfo')
            userInfo = Object.assign(userInfo, res)
            store.set('userInfo', userInfo)
            props.userInfoChange(userInfo)

            props.setModalVisible(false)
          })
        }
      })
    }).catch((info) => {
      console.log('验证失败:', info);
    });
  }

  return (
    <Modal
      title="更改歌单"
      width={300}
      destroyOnClose
      visible={props.modalVisible}
      okText="保存"
      onOk={handleEditSongs}
      onCancel={() => { props.setModalVisible(false); form.resetFields() }}
      maskClosable={false}
      confirmLoading={props.confirmLoading}
    >
      <Form
        form={form}
        name="bindMobie"
        initialValues={{
          songsId: props.initialValue,
        }}
        onFinish={handleEditSongs}
      >
        <FormItem label="网易云歌单ID" name="songsId">
          <Input placeholder="请输入网易云歌单ID"
            suffix={
              <Tooltip title="网易云歌单ID获取方法：登录网页版网易云音乐点击你喜欢的歌单，然后看浏览器URL地址最后一段数字">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            } />
        </FormItem>
      </Form>
    </Modal>
  )
};
