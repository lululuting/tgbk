/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-05-23 14:50:39
 * @LastEditors: TingGe
 * @Description: 联系方式组件 兼容form 接收json 返回json {contact: []}
 * @FilePath: /ting_ge_blog/components/Contact/index.jsx
 */

import React, { Component } from 'react';
import _ from 'lodash';
import qs from 'qs';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import FileUploader from '@/components/FileUploader';
import { Modal, Form, Divider, Input, Avatar, Popover, Select, message } from 'antd';
import {
  QqOutlined,
  WeiboOutlined,
  GithubOutlined,
  WechatOutlined,
  PlusCircleOutlined,
  TwitterOutlined,
  FacebookOutlined
} from '@ant-design/icons';
import styles from './index.module.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Contact extends Component {
  constructor (props) {
    super(props);

    this.state = {
      modeTitle: '联系方式',
      modalVisible: false,
      currentItem: null,
      valueArr: props.value ? _.get(qs.parse(props.value), 'content', []) : [],
      typeArr: [
        {
          label: '哔哩哔哩',
          value: 'bilibili',
          icon: <IconFont type="iconbilibili-line" />,
          color: '#f45a8d'
        },
        {
          label: '微博',
          value: 'weibo',
          icon: <WeiboOutlined />,
          color: '#f9752f'

        },
        {
          label: 'GitHub',
          value: 'github',
          icon: <GithubOutlined />,
          color: '#333'
        },
        {
          label: 'QQ',
          value: 'qq',
          icon: <QqOutlined />,
          color: '#25c5fd'
        },
        {
          label: '微信',
          value: 'wx',
          icon: <WechatOutlined />,
          color: '#2bad13'
        },
        {
          label: '推特',
          value: 'twitter',
          icon: <TwitterOutlined />,
          color: '#25c5fd'
        },
        {
          label: 'FaceBook',
          value: 'facebook',
          icon: <FacebookOutlined />,
          color: '#287eb8'
        }
      ]
    };
  }


  filterValue = () => {
    if (_.isEmpty(this.state.valueArr)) {
      return null;
    }
    return qs.stringify({content: this.state.valueArr});
  };

  // 打开模态框
  showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  // 确定
  handleOk = () => {
    const { currentItem } = this.state;
    this.formRef
      .validateFields()
      .then((fieldsValue) => {

        if (!fieldsValue.code && !fieldsValue.link) {
          message.error('链接与二维码必填其一！');
          return;
        }
        let valueArr  = this.state.valueArr;
        if (currentItem?.index) {
          valueArr[currentItem.index - 1] = fieldsValue;
        } else {
          valueArr = [...this.state.valueArr, fieldsValue];
        }

        this.setState({ valueArr }, () => {
          this.handleCancel();
          if (this.props.onChange) {
            this.props.onChange(this.filterValue());
          }
        });
      })
      .catch((info) => {
        console.log('验证失败:', info);
      });
  };

  // 取消
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      currentItem: null
    });
  };

  edit = (item, index) => {
    this.setState(
      {
        currentItem: {...item, index: index + 1}
      },
      () => {
        this.showModal();
      }
    );
  };

  del = (index) => {
    let valueArr = this.state.valueArr;
    valueArr.splice(index, 1);
    this.setState({ valueArr }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.filterValue());
      }
    });
  };

  switchType = (type) => {
    return (
      _.map(this.state.typeArr, (item, index) =>{
        if (item.value === type) {
          return (
            <Avatar
              key={index}
              size={28}
              icon={item.icon}
              className={classNames(styles['contact-icon'], `${item.value}`)}
              style={item?.color ? {backgroundColor: item.color} : null}
            />
          );
        }
        return null;
      })
    );
  };

  renderForm = () => {
    const {  currentItem, typeArr } = this.state;

    const formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 }
    };

    return (
      <Form
        ref={(ref) => (this.formRef = ref)}
        initialValues={{
          type: currentItem?.type,
          link: currentItem?.link,
          code: currentItem?.code
        }}
        onFinish={this.handleOk}
      >
        <FormItem
          {...formLayout}
          label="联系类型"
          name="type"
          rules={[{ required: true, message: '请选择联系类型' }]}
        >
          <Select style={{ width: '100% ' }} placeholder="请选择联系类型">
            {_.map(typeArr, (item, index)=> {
              return <Option value={item.value} key={index}>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                  <Avatar
                    size={24}
                    icon={item.icon}
                    className={classNames(`contact-icon ${item.value}`)}
                    style={item?.color ? {marginRight: 5, backgroundColor: item.color} : {marginRight: 5}}
                  />
                  {item.label}
                </div>
              </Option>;
            })}
          </Select>
        </FormItem>
        <FormItem {...formLayout} label="链接" name="link">
          <Input placeholder="请输入链接" />
        </FormItem>
        <FormItem name="code" label="二维码" {...formLayout} className={styles['update-code']}>
          <FileUploader
            mode="image"
            accept=".jpg,.png,.jpeg"
            maxSize={1024 * 1024 * 2} // 2m
            cropOption={{
              aspect: 200 / 200
            }}
          />
        </FormItem>
      </Form>
    );
  };

  render () {
    const { valueArr, modalVisible, modeTitle, currentItem } = this.state;
    const { isEdit } = this.props;

    return (
      <div className={styles['contact-box']} ref={(ref) => this.refBox = ref}>
        {
          _.map(valueArr, (item, index) => {
            return (
              <a
                href={item?.link || 'javascript: void(0)'}
                target={item?.link ? '_blank' : null}
                key={index}
                rel="noreferrer"
              >
                {item?.code ? (
                  <Popover
                    placement="bottom"
                    content={
                      <div className={styles['re-code']}>
                        {!isEdit ? (
                          <div className={styles['re-code']}>
                            <img src={item.code} alt="" />
                          </div>
                        ) : (
                          <>
                            <a onClick={() => this.edit(item, index)}>编辑</a>
                            <Divider type="vertical" />
                            <a onClick={() => this.del(index)}>删除</a>
                          </>
                        )}
                      </div>
                    }
                  >
                    {this.switchType(item.type)}
                  </Popover>
                ) : isEdit ? (
                  <Popover
                    placement="bottom"
                    content={
                      <div className={styles['re-code']}>
                        <a onClick={() => this.edit(item, index)}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.del(index)}>删除</a>
                      </div>
                    }
                  >
                    {this.switchType(item.type)}
                  </Popover>
                ) : (
                  this.switchType(item.type)
                )}
              </a>
            );
          })
        }
        {isEdit ? (
          <>
            <PlusCircleOutlined
              onClick={this.showModal}
              style={{ fontSize: 28, marginLeft: 5 }}
              className={classNames('contact-icon plus')}
            />

            <Modal
              getContainer={this.refBox}
              title={`${currentItem ? '编辑' : '添加'}${modeTitle}`}
              width={500}
              destroyOnClose
              visible={modalVisible}
              okText="确定"
              onOk={this.handleOk}
              onCancel={() => {
                this.handleCancel();
                this.formRef.resetFields();
              }}
              maskClosable={false}
            >
              {
                this.renderForm()
              }
            </Modal>
          </>
        ) : null}
      </div>
    );
  }
}
export default Contact;
