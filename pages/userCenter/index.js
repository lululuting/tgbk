/*
 * @Date: 2020-03-18 21:17:27
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-18 00:44:49
 * @FilePath: \ting_ge_blog\pages\userCenter\index.js
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import Router,{withRouter} from 'next/router'
import { Row, Col, Card, Button, Icon, message, Upload, Form, Input, Modal, Avatar, Divider, Typography, Spin, Tooltip } from 'antd'
import classnames from 'classnames'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import ArticeList from '@/components/ArticeList'
import LazyImg from '@/components/LazyImg'
import TagsAdd from '@/components/TagsAdd'
import Contact from '@/components/Contact'
import Rewards from '@/components/Rewards'
import { connect } from 'react-redux'
import { uploadQiniu } from '@/public/utils/uploadQiniu'
import styles from './style.less'

const { Paragraph } = Typography;
const FormItem = Form.Item;

const UserCenter = (props) => {

  const [userInfo, setUserInfo] = useState(null)
  const [articleTotal, setArticleTotal] = useState(props.articleTotalData)
  const [tabKey, setTabKey] = useState('0')
  const [listData, setListData] = useState(props.articleData)
  const [followStatus, setFollowStatus] = useState(false)
  const [settingStatus, setSettingStatus] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [mobileModalVisible, setMobileModalVisible] = useState(false)
  const [updateAvatarFile, setUpdateAvatarFile] = useState([])

  // 页数
  const [page, setPage] = useState(1)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
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
    setLoadMoreLoading(true)
    setIsNoData(false)

    queryLsit(key, 1, 5, listSort).then(res => {
      setListData(res.data)
      setLoadMoreLoading(false)
    })
  }

  // 切换排序
  const listSortFn = () => {
    queryLsit(tabKey, 1, 5, !listSort).then((res) => {
      setListData(res.data)
      setLoadMoreLoading(false)
    })

    setListSort(!listSort)
    setPage(1)
    setLoadMoreLoading(true)
  }

  // 加载更多
  const loadMore = () => {
    setPage(page + 1)
    setLoadMoreLoading(true)

    queryLsit(tabKey, page + 1, 5, listSort).then((res) => {
      if (!res.data.length) {
        setLoadMoreLoading(false)
        setIsNoData(true)
        return
      }

      setListData([].concat(listData, res.data))
      setLoadMoreLoading(false)
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

  useEffect(() => {
    getUserInfo()
  }, [])

  // 查询用户信息
  const getUserInfo = () =>{
    request(serviceApi.getUserInfo, {
      method: 'get',
      params: {
        id: props.router.query.id,
      }
    }).then((res) => {
      if(res && res.code == 200){
        setUserInfo(res.data)
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
      setUpdateAvatarFile(file)
      callback();
    });
    return false;
  };

  //上传用户封面图片方法
  const changeuploadCover = () => {
    uploadQiniu(updateAvatarFile, (res) => {
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
        getUserInfo()
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
    props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
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
    })
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
          {
            userInfo ?
              <LazyImg background={true} params="?imageslim" src={userInfo && userInfo.cover && userInfo.cover}>
                {
                  props.loginUserInfo && ~~props.loginUserInfo.userId === ~~props.router.query.id ?
                    <div className="edit-cover">
                      <Upload
                        name="avatar"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={(file, fileList) => handleImgBeforeUpload(file, fileList, changeuploadCover)}
                        disabled={props.updateUserInfoLoading}
                        accept="image/*"
                      >
                        修改封面
                    </Upload>
                    </div> : null
                }
              </LazyImg>
              : null
          }
        </div>

        <Row className="user-center-page">

          <Col lg={6} md={6} id="user-card">
            {/* up信息列表 */}
            <Card
              bordered={false}
              className={classnames("user-info", { "hide-active": !settingStatus })}
            >
              {props.loginUserInfo && props.loginUserInfo.userId != props.router.query.id ? <div className="btn-box">
                <Button icon="heart" onClick={() => follow(userInfo.userId)}
                  className={
                    classnames('btn', 'follow-btn', {
                      'active': followStatus
                    })
                  }
                >{followStatus ? '已粉' : '关注'}</Button>
              </div> :null}

              {
                props.loginUserInfo && props.loginUserInfo && ~~props.loginUserInfo.userId === ~~props.router.query.id ?
                <div className="btn-box">
                  <Button icon="setting" onClick={() => setSettingStatus(!settingStatus)}
                    className={
                      classnames('btn', 'follow-btn', {
                        'active': settingStatus
                      })
                    }
                  >{settingStatus ? '完成' : '修改'}</Button>
                </div>:null
              }

              <div className="avatar-holder">
                {props.updateUserInfoLoading && <Spin size="large" className="update-loading" />}
                <Avatar size={100} src={userInfo && userInfo.avatar} style={{ color: '#fff', backgroundColor: '#fff' }}>
                  {userInfo && userInfo.userName}
                </Avatar>
                <Upload
                  name="avatar"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file, fileList) => handleImgBeforeUpload(file, fileList, changeupload)}
                  disabled={props.updateUserInfoLoading || !settingStatus}
                  accept="image/*"
                >
                  {
                    settingStatus &&
                    <>
                      <Icon type="upload" style={{ marginRight: 5 }} />
                      更改头像
                    </>
                  }
                </Upload>
              </div>

              <div className="detail">
                <div style={{ textAlign: 'center' }}>
                  <Paragraph className="name" editable={{ onChange: userNameChange }}>{userInfo && userInfo.userName}</Paragraph>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Paragraph className="autograph" editable={{ onChange: autographChange }}>{userInfo && userInfo.autograph}</Paragraph>
                </div>

                <div className="user-option">
                  <Icon type="tool" />
                  <Paragraph editable={{ onChange: postChange }}>{userInfo && userInfo.post}</Paragraph>
                </div>

                <div className="user-option">
                  <Icon type="environment" />
                  <i className="group" />
                  <Paragraph editable={{ onChange: addressChange }}>{userInfo && userInfo.address}</Paragraph>
                </div>

                <div className={classnames("user-option", "tags")}>
                  <Icon type="tags" />
                  <TagsAdd isEdit={settingStatus} data={userInfo && userInfo.tags ? userInfo.tags : []} callback={tagsChangeCallback} />
                </div>



                <div style={{ marginBottom: 40 }}>
                  <Divider>联系方式</Divider>
                  <div>
                    <Contact userInfo={userInfo} isEdit={settingStatus} callback={getUserInfo}/>
                  </div>
                </div>
                

                <div style={{ marginBottom: 40 }}>
                  <div className="tags-title">赞赏码</div>
                  <div>
                    <Rewards userInfo={userInfo} isEdit={settingStatus} callback={getUserInfo}/>
                  </div>
                </div>


                {
                  props.loginUserInfo && ~~props.loginUserInfo.userId === ~~props.router.query.id ?
                   

                  <div style={{ marginBottom: 40 }}>
                    <Divider dashed />

                    <div className="tags-title">账号</div>
                    <p> 
                      <Icon type="mobile" style={{ marginRight: 10 }} />
                      { props.loginUserInfo.mobile ?
                        <span style={{color:'#999'}}>{props.loginUserInfo.mobile}</span>
                        : <span style={{color:'#999'}}>未绑定</span>
                      }
                      {
                        settingStatus &&
                        <Button size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => setMobileModalVisible(true)}>
                          绑定手机
                        </Button>
                      }
                     </p>

                    <div className="tags-title">密码</div>
                    <p>
                      <Icon type="lock" style={{ marginRight: 10 }} />
                      <span style={{color:'#999'}}>******</span>
                      {
                        settingStatus &&
                        <Button size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => setModalVisible(true)}>
                          更改密码
                        </Button>
                      }
                    </p>

                   
                    <BindMobieForm 
                      modalVisible={mobileModalVisible}
                      setModalVisible={setMobileModalVisible}
                      initialValue={props.loginUserInfo.mobile}
                      confirmLoading={props.updateMobileLoading}
                      userInfoChange={props.userInfoChange}
                    />

                    <Modal
                      title="更改密码"
                      width={500}
                      destroyOnClose
                      visible={modalVisible}
                      okText="保存"
                      onOk={handleEditPwd}
                      onCancel={() => { setModalVisible(false) }}
                      maskClosable={false}
                      confirmLoading={props.updatePasswordLoading}
                    >
                      <Form onSubmit={handleEditPwd}>
                        <FormItem label="旧密码" {...formLayout}>
                          {props.form.getFieldDecorator('oldPassword', {
                            rules: [{ required: true, message: '旧密码不能为空' }],
                            initialValue: '',
                          })(<Input.Password placeholder="请输入旧密码" />)}
                        </FormItem>
                        <FormItem label="新密码" {...formLayout}>
                          {props.form.getFieldDecorator('newPassword', {
                            rules: [
                              { required: true, message: '新密码不能为空' },
                              { message: '密码长度应为6~20位之间', min: 6, max: 20 },
                            ],
                            initialValue: '',
                          })(<Input.Password placeholder="请输入新密码（6~20位）" />)}
                        </FormItem>
                      </Form>
                    </Modal>
                  </div>:null
                }

              </div>

            </Card>
          </Col>

          <Col id='right-box' lg={18} md={18}>
            <div className={classnames('list-nav')}>
                {
                  userInfo && ~~userInfo.auth >= 1 ?
                  <Card
                  className="tabs-card"
                  bordered={false}
                  tabList={operationTabList}
                  activeTabKey={tabKey}
                  onTabChange={onTabChange}
                  tabBarExtraContent={
                    <span onClick={listSortFn} className="switch-btn">
                      <Icon type="swap" style={{ color: '#1890ff', marginRight: 10 }} />
                      切换为
                      {
                        listSort ? '热门排序' : '时间排序'
                      }
                    </span>
                  }
                >
  
                  <ArticeList
                    loadMore={loadMore}
                    isNoData={isNoData}
                    loading={loadMoreLoading}
                    data={listData}
                  />
  
                </Card>
                  : <Card bordered={false}>
                    {
                      props.loginUserInfo && userInfo && ~~props.loginUserInfo.auth == ~~userInfo.auth ? 
                      <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 你还不是博主哦, 联系挺哥申请吧！</div>
                      : 
                      <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 该用户不是博主，没有发表过文章！</div>
                    }
                  </Card>
                }
            </div>
          </Col>
        </Row>
      </>
    </>
  )
}


UserCenter.getInitialProps = async (context) => {
  if (!context.query.id) { return {} }
  // 查询自己发表的文章
  const promise1 = new Promise((resolve) => {
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

  // 获取自己发的文件数量 统计
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

  let articleData = await promise1
  let articleTotalData = await promise2

  return { articleData, articleTotalData }
}


const stateToProps = (state) => {
  return {
    loginUserInfo: state.userInfo,
    updateUserInfoLoading: state.updateUserInfoLoading,
    updatePasswordLoading: state.updatePasswordLoading,
    updateMobileLoading: state.updateMobileLoading,
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

const CenterForm = Form.create()(connect(stateToProps, dispatchToProps)(withRouter(UserCenter)));
export default CenterForm


// 绑定手机form组件
const BindMobie = (props)=>{
  const handleEditMobile = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
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
    })
  }

  return(
    <Modal
      title="绑定手机"
      width={300}
      destroyOnClose
      visible={props.modalVisible}
      okText="保存"
      onOk={handleEditMobile}
      onCancel={() => { props.setModalVisible(false); props.form.resetFields()}}
      maskClosable={false}
      confirmLoading={props.confirmLoading}
    >
      <Form onSubmit={handleEditMobile}>
        <FormItem label="手机号">
          {props.form.getFieldDecorator('mobile', {
            rules: [
              { required: true, message: '手机号不能为空' },
              { message: '手机号不正确', pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g")},
            ],
            initialValue: props.initialValue,
          })(<Input placeholder="请输入要绑定的手机号"       
            suffix={
            <Tooltip title="绑定的手机号将作为登录账号。第一次绑定的初始密码为123456，后面更换绑定不重置，密码不可逆，请妥善保管！">
              <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          } />)}
        </FormItem>
      </Form>
    </Modal>
  )
};

const BindMobieForm = Form.create()(BindMobie)
