import React from 'react';
import classnames from 'classnames';
import { Input, Avatar, Modal, Form, Button, message } from 'antd';
import Router from 'next/router';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import config from '@/config';
import store from '@/store';
import Cookies from 'js-cookie';
import { WeiboOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './style.module.less';

class Login extends React.Component {
  state = {
    loginVisible: false,
    agreementVisible: false
  };

  handleSubmit = (values) => {
    request(serviceApi.login, {
      method: 'post',
      data: values
    }).then((res) => {
      if (res && res.code == 200) {
        Cookies.set('userInfo', res.data, {
          expires: 1
        });
        // 存入react-redux
        // this.props.userInfoChange(res.data)
        store.dispatch({
          type: 'changeUserInfo',
          payload: res.data
        });

        this.setState({
          loginVisible: false
        });

        message.success('登陆成功！');

        // 本页面重新加载一次
        Router.reload();

        // 查询用户消息
        this.getMsg();
      }
    });
  };

  setVisible = (visible) => {
    this.setState({
      loginVisible: visible
    });
  };

  getMsg = () => {
    request(serviceApi.getMsg).then((res) => {
      // 存入react-redux
      store.dispatch({
        type: 'changeMsg',
        payload: res && res.data
      });
    });
  };

  // 微博登录
  weiboLogin = () => {
    window.location.href = `https://api.weibo.com/oauth2/authorize?client_id=${config.weibo.client_id}&redirect_uri=${config.weibo.redirect_uri}&response_type=code`;
  };

  render () {
    const loginLoading = store.getState().loginLoading;

    return (
      <Modal
        className={styles['login-box']}
        open={this.state.loginVisible}
        footer={null}
        onCancel={() => {
          this.setState({ loginVisible: false });
        }}
        maskClosable={false}
        width={380}
        bodyStyle={{ padding: 40 }}
      >
        {/* logo */}
        <div className={styles['login-logo']}>
          <div className={styles['logo']}>
            <img src="/logo1.png" alt="" />
          </div>
          <div className={styles['title']}>
            <p className={styles['b-title']}>TinggeBlog</p>
            <p className={styles['s-title']}>冲浪记录站</p>
          </div>
        </div>

        <Form className={styles['login-form']} onFinish={this.handleSubmit}>
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机号!'
              }
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="账号"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码!'
              }
            ]}
          >
            <Input
              size="large"
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <div>
            <a
              onClick={() =>
                message.warning(
                  '忘记就忘记了，功能太多写不过来，联系挺哥重置吧！'
                )
              }
              className={styles['login-form-forgot']}
            >
                忘记密码
            </a>

            <Button
              loading={loginLoading}
              disabled={loginLoading}
              size="large"
              type="primary"
              htmlType="submit"
              className={styles['login-form-button']}
            >
                登录
            </Button>

            <div className={styles['login-option']}>
              <Avatar
                onClick={this.weiboLogin}
                size={28}
                icon={<WeiboOutlined />}
                className={classnames(styles['contact-icon'], styles['weibo'])}
              />
            </div>

            <div className={styles['agreement']}>
                登录即同意
              <a onClick={() => this.setState({ agreementVisible: true })}>
                  「软件许可及服务协议」
              </a>
            </div>

            <div className={styles['tips']}>
              tips: 微博登录会自动注册，登录后请绑定手机号
            </div>
          </div>
        </Form>

        <Modal
          open={this.state.agreementVisible}
          footer={null}
          onCancel={() => {
            this.setState({ agreementVisible: false });
          }}
          maskClosable={false}
          width={380}
          bodyStyle={{ padding: 40 }}
        >
            1.请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。
        </Modal>
      </Modal>
    );
  }
}

export default Login;
