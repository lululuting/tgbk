/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2024-01-04 14:21:28
 * @FilePath: /ting_ge_blog/pages/admin/user/index.jsx
 */
import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import AdminLayout from '@/components/AdminLayout';
import MultilineText from '@/components/MultilineText';
import LazyImg from '@/components/LazyImg';
import Contact from '@/components/Contact';
import FileUploader from '@/components/FileUploader';
import TagsAdd from '@/components/TagsAdd';
import { filtersDict, dictToArr } from '@/public/utils/dict';
import { baseBatch } from '@/public/utils/baseRequest';
import request from '@/public/utils/request';


import serviceApi from '@/config/service';
import {
  Modal,
  Badge,
  Radio,
  message,
  Divider,
  Button,
  Form,
  Switch,
  Input,
  Select,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UnlockOutlined,
  LockOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import { getIsLogin } from '@/public/utils/utils';
import BasePage from '../basePage';


const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class UserManage extends BasePage {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modelName: '用户',
      queryListUrl: serviceApi.getUserList,
      delListUrl: serviceApi.delUser,
      modalVisible: false,
      orderBy: [
        ['status', 'desc'],
        ['id', 'desc']
      ]
    });
  }

  getListFilters = () => {
    const { type } = this.state;
    return (
      type && {
        type
      }
    );
  };

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
    const { currentItem } = this.state;
    this.formRef.validateFields().then((fieldsValue) => {
      if (currentItem.id) {
        fieldsValue.id = currentItem.id;
      }

      request(serviceApi.addEditUser, {
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

  editUser = (item) => {
    this.setState({
      currentItem: item
    }, () => {
      this.setState({
        modalVisible: true
      });
    });
  };

  resetPassword = (ids) => {
    Modal.confirm({
      title: `重置密码${this.state.modelName}`,
      content: `重置${this.state.selectedRowKeys?.length ? '这些' : '该'}${
        this.state.modelName
      }的密码吗？重置密码为123456，请牢记！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.resetPassword, {
          ids
        }).then((res) => {
          if (res?.code === 200) {
            message.success(res.msg);
            this.reset();
            this.queryList();
          }
        });
      }
    });
  };

  // 冻结
  frozenUser = (ids) => {
    Modal.confirm({
      title: `冻结${this.state.modelName}`,
      content: `冻结${this.state.selectedRowKeys?.length ? '这些' : '该'}${
        this.state.modelName
      }吗？违规了就要毫不犹豫！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.frozenUser, {
          ids
        }).then((res) => {
          if (res?.code === 200) {
            message.success(res.msg);
            this.reset();
            this.queryList();
          }
        });
      }
    });
  };

  // 解冻
  thawUser = (ids) => {
    Modal.confirm({
      title: `解冻${this.state.modelName}`,
      content: `解冻${this.state.selectedRowKeys?.length ? '这些' : '该'}${
        this.state.modelName
      }吗？整改完成后可以放出来！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.thawUser, {
          ids
        }).then((res) => {
          if (res?.code === 200) {
            message.success(res.msg);
            this.reset();
            this.queryList();
          }
        });
      }
    });
  };

  getTableColumns = () => {
    return [
      {
        title: '昵称',
        dataIndex: 'userName',
        width: 150,
        fixed: 'left',
        render: (text, record) => {
          return (
            <a
              href={`/userCenter/${record.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <MultilineText text={record.userName} tooltip rows={1} />
            </a>
          );
        }
      },
      {
        title: '头像',
        fixed: 'left',
        width: 76,
        dataIndex: 'avatar',
        render: (text, record) => {
          return (
            <a
              href={`/userCenter/${record.id}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                height: 44,
                width: 44,
                borderRadius: '50%',
                overflow: 'hidden'
              }}
            >
              <LazyImg
                src={text}
                background
                alt={record.title}
                params="?imageView2/1/w/44/h/44"
              />
            </a>
          );
        }
      },
      {
        title: '类型',
        width: 100,
        dataIndex: 'auth',
        render: (text) => {
          return <span>{filtersDict('auth', text)}</span>;
        }
      },
      {
        title: '账号',
        width: 150,
        dataIndex: 'mobile',
        render: (text, record) => {
          return <span>{text ? text : (record.wbUid) ? '微博登陆' : ''}</span>;
        }
      },
      {
        title: '文章数',
        width: 100,
        dataIndex: 'articleCount',
        render: (text) => {
          return <span>{text}</span>;
        }
      },
      {
        title: '粉丝数',
        width: 100,
        dataIndex: 'fansCount',
        render: (text) => {
          return <span>{text}</span>;
        }
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        render: (text) => {
          return (
            <div>
              {text ? (
                <Badge status="processing" text="正常" />
              ) : (
                <Badge status="error" text="已下架" />
              )}
            </div>
          );
        }
      },
      {
        title: '联系方式',
        dataIndex: 'contact',
        width: 300,
        render: (text) => {
          return <Contact key={text} value={text} isEdit={false} />;
        }
      },
      {
        title: '标签',
        width: 200,
        dataIndex: 'tags',
        render: (text) => {
          return  <TagsAdd value={text} key={text} isEdit={false}/>;
        }
      },
      {
        title: '操作',
        fixed: 'right',
        width: 206,
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.resetPassword([record.id]);
                }}
              >
                重置
              </a>
              <Divider type="vertical" />
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.editUser(record);
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
              <Divider type="vertical" />
              {record.status ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.frozenUser([record.id]);
                  }}
                >
                  冻结
                </a>
              ) : (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.thawUser([record.id]);
                  }}
                >
                  解冻
                </a>
              )}
            </div>
          );
        }
      }
    ];
  };

  renderExtraContent = () => {
    return (
      <div>
        <RadioGroup
          defaultValue={0}
          onChange={this.typeChange}
          buttonStyle="solid"
        >
          <RadioButton key="all" value={0} style={{ marginBottom: 5 }}>
            全部
          </RadioButton>
          {_.map(dictToArr('auth'), (item) => {
            return (
              <RadioButton
                key={item.value}
                value={item.value}
                style={{ marginBottom: 5 }}
              >
                {item.label}
              </RadioButton>
            );
          })}
        </RadioGroup>
      </div>
    );
  };

  renderOther = () => {
    const { modalVisible, currentItem, modelName } = this.state;
    const { loading } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    };
    return (
      <>
        <Modal
          width={1000}
          title={currentItem ? `编辑${modelName}` : `新增${modelName}`}
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
            initialValues={currentItem}
          >
            <Row>
              <Col xs={12}>
                <Form.Item
                  name="auth"
                  label="类型"
                  rules={[{ required: true, message: '请选择类型!' }]}
                >
                  <Select placeholder="权限类型">
                    {_.map(dictToArr('auth'), (item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="userName"
                  label="昵称"
                  rules={[{ required: true, message: '请输入昵称！' }]}
                >
                  <Input placeholder="用户昵称" />
                </Form.Item>
                <Form.Item
                  name="mobile"
                  label="手机号"
                  rules={[{ required: !(currentItem && currentItem.wbUid), message: '请输入手机号！' }]}
                  extra={(currentItem && currentItem.wbUid) ? <span>该用户可以以微博登陆</span> : null}
                >
                  <Input placeholder="用户手机号" />
                </Form.Item>
                <Form.Item
                  name="post"
                  label="职业"
                >
                  <Input placeholder="用户职业" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="地址"
                >
                  <Input.TextArea rows={2} maxLength={50} placeholder="用户地址" />
                </Form.Item>


                <Form.Item
                  name="autograph"
                  label="个性签名"
                >
                  <Input.TextArea rows={2} maxLength={50} placeholder="个性签名" />
                </Form.Item>

                <Form.Item
                  name="tags"
                  label="标签"
                >
                  <TagsAdd isEdit />
                </Form.Item>

                <Form.Item
                  name="contact"
                  label="联系方式"
                >
                  <Contact isEdit/>
                </Form.Item>

              </Col>
              <Col xs={12}>
                <Form.Item
                  name="avatar"
                  label="头像"
                >
                  <FileUploader
                    mode="image"
                    accept=".jpg,.png,.jpeg,.gif"
                    maxSize={1024 * 1024 * 2} // 2m
                    cropOption={{
                      aspect: 100 / 100
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="cover"
                  label="封面"
                >
                  <FileUploader
                    mode="image"
                    accept=".jpg,.png,.jpeg,.gif"
                    maxSize={1024 * 1024 * 10} // 10m
                    cropOption={{
                      aspect: 1920 / 200
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="status"
                  label="账号状态"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="正常" unCheckedChildren="冻结" />
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Modal>
      </>
    );
  };

  renderActionBoxLeft = () => {
    const { selectedRowKeys } = this.state;
    return (
      <>
        <Button
          type="primary"
          danger
          style={{ marginRight: 8 }}
          icon={<DeleteOutlined />}
          onClick={() => this.delList(selectedRowKeys)}
          disabled={!selectedRowKeys.length}
        >
          批量删除
        </Button>
        <Button
          type="default"
          danger
          style={{ marginRight: 8 }}
          icon={<LockOutlined />}
          onClick={() => this.frozenUser(selectedRowKeys)}
          disabled={!selectedRowKeys.length}
        >
          批量冻结
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          icon={<UnlockOutlined />}
          onClick={() => this.thawUser(selectedRowKeys)}
          disabled={!selectedRowKeys.length}
        >
          批量解冻
        </Button>
      </>
    );
  };

  renderActionBoxRight = () => {
    return (
      <>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            this.setState({
              modalVisible: true
            });
          }}
        >
          添加用户
        </Button>
      </>
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
    loading: state.getUserListLoading
  };
};

const Component = withRouter(connect(stateToProps, null)(UserManage));
Component.AdminLayout = AdminLayout;

export default Component;
