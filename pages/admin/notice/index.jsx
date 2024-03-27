/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2023-01-17 14:41:39
 * @FilePath: /ting_ge_blog/pages/admin/notice/index.jsx
 */
import React from 'react';
import moment from 'moment';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import AdminLayout from '@/components/AdminLayout';
import request from '@/public/utils/request';
import MultilineText from '@/components/MultilineText';
import serviceApi from '@/config/service';
import {
  Form,
  Button,
  Switch,
  Modal,
  Badge,
  Input,
  message,
  DatePicker,
  InputNumber,
  Divider
} from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { getIsLogin } from '@/public/utils/utils';
import BasePage from '../basePage';

const { RangePicker } = DatePicker;

class NoticeManage extends BasePage {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modelName: '公告',
      modalVisible: false,
      currentItem: null,
      queryListUrl: serviceApi.getNoticeList,
      delListUrl: serviceApi.delNotice,
      orderBy: [
        ['status', 'desc'],
        ['id', 'desc']
      ]
    });
  }


  handleModalCancel = () => {
    this.setState({
      currentItem: null
    }, () => {
      this.setState({
        modalVisible: false
      });
    });
  };

  handleOk = () => {
    this.formRef.validateFields().then((fieldsValue) => {
      const { currentItem } = this.state;

      if (currentItem?.id) {
        fieldsValue.id = currentItem.id;
      }

      fieldsValue.startTime = fieldsValue.time[0];
      fieldsValue.endTime = fieldsValue.time[1];
      delete fieldsValue.time;

      request(serviceApi.addEditNotice, {
        method: 'post',
        data: fieldsValue
      }).then((res) => {
        if (res.code === 200) {
          this.handleModalCancel();
          this.formRef.resetFields();
          message.success(res.msg);
          this.queryList();
        }
      });
    });
  };

  editNotice = (item) => {
    this.setState({
      currentItem: item
    }, () => {
      this.setState({
        modalVisible: true
      });
    });
  };

  getTableColumns = () => {
    return [
      {
        title: '标题',
        dataIndex: 'title',
        fixed: 'left',
        width: 132,
        render: (text) => {
          return (
            <span>
              <MultilineText text={text} tooltip rows={1}/>
            </span>
          );
        }
      },
      {
        title: '内容',
        dataIndex: 'content',
        render: (text) => {
          return (
            <span>
              <MultilineText text={text} tooltip rows={1}/>
            </span>
          );
        }
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        width: 173,
        render: (text) => {
          return (
            <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>
          );
        }
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        width: 173,
        render: (text) => {
          return (
            <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>
          );
        }
      },
      {
        title: '按钮文字',
        dataIndex: 'btnText',
        width: 100,
        render: (text) => {
          return (
            <span>
              <MultilineText text={text} tooltip rows={1}/>
            </span>
          );
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (text) => {
          return (
            <div>
              {
                text ? (
                  <Badge status="processing" text="生效中" />
                ) : (
                  <Badge status="default" text="已下架" />
                )
              }
            </div>
          );
        }
      },
      {
        title: '操作',
        fixed: 'right',
        width: 110,
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.editNotice(record);
                }}
              >
              编辑
              </a>
              <Divider type="vertical" />
              <a
                key="delete"
                onClick={(e) => {
                  e.preventDefault();
                  this.delList([record.id]);
                }}
              >
              删除
              </a>
            </div>
          );
        }
      }
    ];
  };

  renderOther = () => {
    const { modalVisible, currentItem} = this.state;
    const { loading } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    };

    if (currentItem) {
      currentItem.time = [moment(currentItem.startTime), moment(currentItem.endTime)];
    }

    return (
      <>
        <Modal
          title={currentItem ? '编辑公告' : '新增公告'}
          open={modalVisible}
          onOk={this.handleOk}
          confirmLoading={loading}
          onCancel={() => {
            this.handleModalCancel();
            this.formRef.resetFields();
          }}
          maskClosable={false}
          className="formModal"
        >
          <Form
            key={currentItem?.id}
            {...formItemLayout}
            ref={(ref) => (this.formRef = ref)}
            onFinish={this.handleOk}
            initialValues={currentItem || {duration: 5, status: 1, btnText: '确定'}}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题!' }]}
            >
              <Input maxLength={20} placeholder="公告标题" />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容!' }]}
            >
              <Input.TextArea  maxLength={100} rows={3} placeholder="公告内容" />
            </Form.Item>

            <Form.Item
              name="time"
              label="时间"
              rules={[{ required: true, message: '请选择时间!' }]}
            >
              <RangePicker
                ranges={{
                  '3天': [moment(), moment().add(3, 'days')],
                  '5天': [moment(), moment().add(5, 'days')],
                  '10天': [moment(), moment().add(10, 'days')],
                  '这个月': [moment(), moment().endOf('month')]
                }}
                showTime
                format="YYYY/MM/DD HH:mm:ss"
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label="持续时间"
              rules={[{ required: true, message: '请输入公告持续时间!' }]}
              tooltip={{
                title: '公告弹出的持续时间，0为一直显示，默认为5秒。',
                icon: <InfoCircleOutlined />
              }}
            >
              <InputNumber placeholder="公告持续时间" min={0} max={100} defaultValue={5} />
            </Form.Item>

            <Form.Item
              name="btnText"
              label="按钮文字"
              tooltip={{
                title: 'DIY按钮文字，自定义确定按钮的文案，默认为 “确定”。',
                icon: <InfoCircleOutlined />
              }}
            >
              <Input placeholder="确定按钮的文字" maxLength={10}/>
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              valuePropName="checked"
            >
              <Switch checkedChildren="开" unCheckedChildren="关" />
            </Form.Item>

          </Form>
        </Modal>
      </>
    );
  };

  renderActionBoxLeft = () => {
    const { selectedRowKeys } = this.state;
    return (
      <Button
        type="primary"
        danger
        style={{ marginRight: 8 }}
        icon={<DeleteOutlined />}
        onClick={()=>this.delList(selectedRowKeys)}
        disabled={!selectedRowKeys.length}
      >
      批量删除
      </Button>
    );
  };

  renderActionBoxRight = () => {
    return (
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={()=>{
          this.setState({
            modalVisible: true
          });
        }}
      >
        添加公告
      </Button>
    );
  };
}


export async function getServerSideProps (context) {
  const isLogin = await getIsLogin(context.req);
  if (!isLogin) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
  return { props: {} };
}


const stateToProps = (state) => {
  return {
    loading: state.getNoticeListLoading
  };
};

const Component = withRouter(connect(stateToProps, null)(NoticeManage));
Component.AdminLayout = AdminLayout;

export default Component;
