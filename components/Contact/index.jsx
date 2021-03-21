/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-01-31 14:33:00
 * @LastEditors: TingGe
 * @Description: 联系方式组件
 * @FilePath: /tg-blog/components/Contact/index.js
 */

import React, { Component } from 'react';
import { uploadQiniu } from '@/public/utils/uploadQiniu'
import classnames from 'classnames'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import IconFont from '@/components/IconFont'
import {
  Modal,
  Form,
  Divider,
  Input,
  Upload,
  message,
  Avatar,
  Popover,
  Select,
} from 'antd';
import {
  QqOutlined,
  WeiboOutlined,
  GithubOutlined,
  WechatOutlined,
  PictureOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Contact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      currentItem: null,
      fileList: [],
      previewImage: '',
      previewVisible: false,
    };
  }


  // 打开模态框
  showModal = () => {
    this.setState({
      modalVisible: true
    })
  }


  // 确定提交
  handleOk = () => {
    const { fileList, currentItem } = this.state;
    this.formRef.validateFields().then((fieldsValue) => {
      // 编辑 新增
      if (currentItem && currentItem.id) {
        fieldsValue.id = currentItem.id
      }

      // 二维码
      fieldsValue.code = fileList && fileList[0] ? fileList[0].url : null;

      // 新增编辑联系方式
      const uploadContact = () => {
        return new Promise((resolve =>
          request(serviceApi.addEditContact, {
            method: 'post',
            data: fieldsValue
          }).then(res => {
            if (res.code == 200) {
              this.props.callback();
              message.success('成功');
              this.handleCancel();
              resolve();
            }
          })
        ))
      }

      // 判断封面是否更改
      if (fileList && fileList[0] && fileList[0].size) {
        uploadQiniu(fileList[0], uploadContact)
        return false;
      }

      uploadContact()

    }).catch((info) => {
      console.log('验证失败:', info);
    });
  }

  // 取消 
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      currentItem: null,
      fileList: [],
    })
  }

  edit = (item) => {
    this.setState({
      currentItem: item,
      fileList: item.code && [{
        uid: item.id,
        name: 'image.png',
        status: 'done',
        url: item.code,
      }],
    }, () => {
      this.showModal()
    })
  }


  del = (id) => {
    Modal.confirm({
      title: '删除联系方式',
      content: '老铁，确定删除该联系方式吗？',
      onOk: () => {
        request(serviceApi.delContact, {
          method: 'post',
          data: { id }
        }).then(res => {
          if (res.code == 200) {
            message.success('成功')
            this.props.callback()
          }
        })
      },
      onCancel() { },
    });
  }

  // 解析为base64位 
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    // 读取文件
    reader.readAsDataURL(img);
  }

  // 图片预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const { modalVisible, fileList, previewImage, previewVisible, currentItem } = this.state;
    const { userInfo, isEdit, updateLoading } = this.props;
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    
    const updateProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('老铁你检查一下是不是JPG/PNG的图片文件!');
          return false
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('2MB以下!');
          return false
        }

        this.getBase64(file, (imageUrl) => {
          file.url = imageUrl
          this.setState({
            previewImage: imageUrl,
            fileList: [file],
          })
        });
        return false;
      },
      fileList: this.state.fileList
    };

    const switchType = (type) => {
      switch (type) {
        case 'bilibili':
          return <Avatar size={28} icon={<IconFont type="iconbilibili-line" />} className={classnames("contact-icon bilibili")} />
        case 'weibo':
          return <Avatar size={28} icon={<WeiboOutlined />} className={classnames("contact-icon weibo")} />
        case 'github':
          return <Avatar size={28} icon={<GithubOutlined />} className={classnames("contact-icon github")} />
        case 'qq':
          return <Avatar size={28} icon={<QqOutlined />} className={classnames("contact-icon qq")} />
        case 'wx':
          return <Avatar size={28} icon={<WechatOutlined />} className={classnames("contact-icon wx")} />
      }
    }

    return (
      <div className="contact-box">
        {
          userInfo && userInfo.contact && userInfo.contact.length ?
            <For each="item" index="index" of={userInfo.contact}>
              <a href={item.link && item.link} target="_blank" key={index}>
                {
                  item.code ?
                    <Popover placement="bottom" content={(
                      <div className="re-code">
                        {
                          !isEdit ?
                            <div className="re-code"><img src={item.code} alt="" /></div>
                            :
                            <>
                              <a onClick={() => this.edit(item)}>编辑</a>
                              <Divider type="vertical" />
                              <a onClick={() => this.del(item.id)}>删除</a>
                            </>

                        }
                      </div>
                    )}>
                      {(switchType(item.type))}
                    </Popover>
                    :
                    isEdit ?
                      <Popover placement="bottom" content={(
                        <div className="re-code">
                          <a onClick={() => this.edit(item)}>编辑</a>
                          <Divider type="vertical" />
                          <a onClick={() => this.del(item.id)}>删除</a>
                        </div>
                      )}>
                        {(switchType(item.type))}
                      </Popover>
                      :
                      switchType(item.type)
                }
              </a>
            </For>
            :
            <If condition={userInfo && !userInfo.contact.length && !isEdit}>
              <div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 暂无！</div>
            </If>
        }

        <If condition={isEdit}>
          <PlusCircleOutlined onClick={this.showModal} style={{ fontSize: 28 }} className={classnames("contact-icon plus")} />
        </If>

        <Modal
          title="添加联系方式"
          width={500}
          destroyOnClose
          visible={modalVisible}
          okText="保存"
          onOk={this.handleOk}
          onCancel={() => { this.handleCancel(); this.formRef.resetFields() }}
          maskClosable={false}
          confirmLoading={updateLoading}
        >
          <Form
            ref={(ref)=>this.formRef = ref}
            initialValues={{
              type: currentItem ? currentItem.type : undefined,
              link: currentItem ? currentItem.link : undefined,
            }}
            onFinish={this.handleOk}
          >
            <FormItem {...formLayout}
              label="联系类型"
              name="type"
              rules={[{ required: true, message: '请选择联系类型' }]}
            >
              <Select style={{ width: '100% ' }} placeholder="请选择联系类型">
                <Option value="bilibili">哔哩哔哩</Option>
                <Option value="weibo">新浪微博</Option>
                <Option value="github">GitHub</Option>
                <Option value="qq">QQ</Option>
                <Option value="wx">微信</Option>
              </Select>
            </FormItem>
            <FormItem {...formLayout}
              label="链接"
              name="link"
            >
              <Input placeholder="请输入链接" />
            </FormItem>
            <FormItem label="二维码" {...formLayout} className="update-code">
              <Upload.Dragger
                {...updateProps}
                name="files"
                listType="picture-card"
                onPreview={this.handlePreview}
                style={fileList && fileList.length >= 1 ? null : { padding: 18, border: '1px dashed #d9d9d9' }}
              >
                {fileList && fileList.length >= 1 ? null :
                  <>
                    <p className="ant-upload-drag-icon">
                      <PictureOutlined />
                    </p>
                    <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
                    <p className="ant-upload-hint">只能上传限png、jpg 格式的图片，2m以下！</p>
                  </>
                }
              </Upload.Dragger>

              <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
};
export default Contact;
