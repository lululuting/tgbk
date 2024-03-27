/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2024-01-04 14:21:58
 * @FilePath: /ting_ge_blog/pages/admin/banner/index.jsx
 */
import React from 'react';
import moment from 'moment';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import AdminLayout from '@/components/AdminLayout';
import request from '@/public/utils/request';
import { filtersDict, dictToArr, dict } from '@/public/utils/dict';
import FileUploader from '@/components/FileUploader';
import LazyImg from '@/components/LazyImg';
import MultilineText from '@/components/MultilineText';
import serviceApi from '@/config/service';
import {
  Form,
  Button,
  Select,
  Switch,
  Modal,
  Badge,
  Radio,
  Input,
  message,
  Divider
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { getIsLogin } from '@/public/utils/utils';
import BasePage from '../basePage';


const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BannerManage extends BasePage {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modelName: 'Banner',
      modalVisible: false,
      currentItem: null,
      queryListUrl: serviceApi.getBannerList,
      delListUrl: serviceApi.delBanner,
      orderBy: [
        ['status', 'desc'],
        ['type', 'desc'],
        ['id', 'desc']
      ],
      selectType: undefined
    });
  }

  componentDidMount () {
    this.queryList();
  }

  getListFilters = () => {
    const { type } = this.state;
    return type && {
      type
    };
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
    this.formRef.validateFields().then((fieldsValue) => {
      const { currentItem } = this.state;

      if (currentItem && currentItem.id) {
        fieldsValue.id = currentItem.id;
      }
      request(serviceApi.addEditBanner, {
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

  editBanner = (item) => {
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
        title: '封面',
        dataIndex: 'url',
        fixed: 'left',
        width: 102,
        render: (text, record) =>  {
          return (
            <a
              href={`/detail/${record.id}`} target="_blank" rel="noreferrer"
              style={{display: 'flex', height: 44, width: 70}}
            >
              <LazyImg
                background
                src={text}
                alt={record.title}
              />
            </a>
          );
        }
      },
      {
        title: '标题',
        dataIndex: 'title',
        fixed: 'left',
        render: (text, record) => {
          return (
            <a href={`/detail/${record.id}`} target="_blank" rel="noreferrer">
              <MultilineText text={record.title} tooltip/>
            </a>
          );
        }
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 100,
        render: (text) => {
          return (
            <span>{filtersDict('bannerType', text)}</span>
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
        title: '作者',
        dataIndex: 'userName',
        width: 112,
        render: (text, record) => {
          return (
            <a href={`/userCenter/${record?.user?.id}`} target="_blank" rel="noreferrer">
              <MultilineText style={{width: 80}} text={record?.user?.userName} rows={1} tooltip/>
            </a>
          );
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text) => {
          return (
            <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>
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
                  this.editBanner(record);
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
          {_.map(dictToArr('bannerType'), (item) => {
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
    const { modalVisible, currentItem, selectType} = this.state;
    const { loading } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    };
    return (
      <>
        <Modal
          title={currentItem ? '编辑Banner' : '新增Banner'}
          visible={modalVisible}
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
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '请选择类型!' }]}
            >
              <Select placeholder="请选择类型" onChange={(value)=>{ this.setState({selectType: value})}}>
                {_.map(dictToArr('bannerType'), (item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题!' }]}
            >
              <Input placeholder="请输入标题" />
            </Form.Item>

            <Form.Item
              name="link"
              label="链接"
              // rules={[{ required: true, message: '请输入链接!' }]}
            >
              <Input placeholder="请输入链接" />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true }]}
              valuePropName="checked"
            >
              <Switch checkedChildren="开" unCheckedChildren="关" />
            </Form.Item>

            <Form.Item name="url" label="封面"
              dependencies={['type']}
              rules={[{ required: true, message:  selectType === _.get(dict,'bannerType.homeIframe') ? '请输入链接!' : '请上传封面!' }]}
            >
              {
                selectType === _.get(dict,'bannerType.homeIframe') ?
                  <Input placeholder="请输入链接" />
                :
                <FileUploader
                  mode="image"
                  accept=".jpg,.png,.jpeg,.gif"
                  maxSize={1024 * 1024 * 10} // 10m
                  cropOption={{
                    aspect: 260 / 165
                  }}
                />
              }
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
        添加Banner
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
    loading: state.getBannerListLoading
  };
};

const Component = withRouter(connect(stateToProps, null)(BannerManage));
Component.AdminLayout = AdminLayout;

export default Component;
