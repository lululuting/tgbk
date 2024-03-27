/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-03-29 21:46:31
 * @FilePath: /ting_ge_blog/pages/admin/article/index.jsx
 */
import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import AdminLayout from '@/components/AdminLayout';
import MultilineText from '@/components/MultilineText';
import LazyImg from '@/components/LazyImg';
import { dictToArr } from '@/public/utils/dict';
import { baseBatch } from '@/public/utils/baseRequest';
import serviceApi from '@/config/service';
import {
  Modal,
  Badge,
  Radio,
  message,
  Divider,
  Button
} from 'antd';
import { PlusOutlined, DeleteOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';
import _ from 'lodash';
import BasePage from '../basePage';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BannerManage extends BasePage {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modelName: '文章',
      queryListUrl: serviceApi.getArticleList,
      delListUrl: serviceApi.delArticle,
      modalVisible: false,
      orderBy: [
        ['state', 'asc'],
        ['status', 'asc'],
        ['id', 'desc']
      ]
    });
  }

  getListFilters = () => {
    const { type } = this.state;
    return type ? {
      type,
      admin: true
    } : { admin: true};
  };

  // 冻结
  frozenArticle = (ids) => {
    Modal.confirm({
      title: '冻结文章',
      content: `冻结${this.state.selectedRowKeys?.length ? '这些' : '该'}文章吗？违规了就要毫不犹豫！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.frozenArticle, {
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
  thawArticle = (ids) => {
    Modal.confirm({
      title: '解冻文章',
      content: `解冻${this.state.selectedRowKeys?.length ? '这些' : '该'}文章吗？整改完成后可以放出来！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.thawArticle, {
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
        title: '封面',
        fixed: 'left',
        width: 102,
        dataIndex: 'cover',
        render: (text, record) => {
          return (
            <a
              href={`/detail/${record.id}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', height: 44, width: 70 }}
            >
              <LazyImg
                src={text}
                background
                alt={record.title}
                params="?imageView2/1/w/70/h/40"
              />
            </a>
          );
        }
      },
      {
        title: '标题',
        dataIndex: 'title',
        render: (text, record) => {
          return (
            <a href={`/detail/${record.id}`} target="_blank" rel="noreferrer">
              <MultilineText text={record.title} tooltip rows={1}/>
            </a>
          );
        }
      },
      {
        title: '类型',
        width: 70,
        dataIndex: 'type',
        render: (text, record) => {
          return <span>{_.get(record, 'type.typeName')}</span>;
        }
      },
      {
        title: '阅读量',
        width: 100,
        dataIndex: 'viewCount',
        render: (text) => {
          return <span>{text}</span>;
        }
      },
      {
        title: '获赞',
        width: 100,
        dataIndex: 'likeCount',
        render: (text) => {
          return <span>{text}</span>;
        }
      },
      {
        title: '作者',
        dataIndex: 'userName',
        width: 100,
        render: (text, record) => {
          return (
            <a
              href={`/userCenter/${record?.user?.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <MultilineText
                style={{ width: 80 }}
                text={record?.user?.userName}
                rows={1}
                tooltip
              />
            </a>
          );
        }
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <div>
              {!record.state ? (
                <Badge status="error" text="冻结中" />
              ) : record.status ? (
                <Badge status="processing" text="生效中" />
              ) : (
                <Badge status="default" text="已下架" />
              )}
            </div>
          );
        }
      },
      {
        title: '操作',
        fixed: 'right',
        width: 156,
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`/articleEdit/${record.id}`);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                key="delete"
                onClick={(e) => {
                  e.preventDefault();
                  this.delArticle([record.id]);
                }}
              >
                删除
              </a>
              <Divider type="vertical" />
              {record.state ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.frozenArticle([record.id]);
                  }}
                >
                  冻结
                </a>
              ) : (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.thawArticle([record.id]);
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
          {_.map(dictToArr('articleType'), (item) => {
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
          onClick={() => this.frozenArticle(selectedRowKeys)}
          disabled={!selectedRowKeys.length}
        >
          批量冻结
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          icon={<UnlockOutlined />}
          onClick={() => this.thawArticle(selectedRowKeys)}
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
            window.open('/articleAdd');
          }}
        >
            添加文章
        </Button>
      </>
    );
  };
}

const stateToProps = (state) => {
  return {
    loading: state.getArticleListLoading
  };
};

const Component = withRouter(connect(stateToProps, null)(BannerManage));
Component.AdminLayout = AdminLayout;

export default Component;
