/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-05-14 14:05:42
 * @FilePath: /ting_ge_blog/pages/admin/comment/index.jsx
 */
import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import AdminLayout from '@/components/AdminLayout';
import MultilineText from '@/components/MultilineText';
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
import { DeleteOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { getIsLogin } from '@/public/utils/utils';
import BasePage from '../basePage';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CommentManage extends BasePage {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modelName: '评论',
      queryListUrl: serviceApi.getCommentList,
      delListUrl: serviceApi.delComment,
      orderBy: [
        ['status', 'asc'],
        ['id', 'desc']
      ]
    });
  }

  getListFilters = () => {
    const { type } = this.state;
    return type !== null && {
      status: type
    };
  };

  // 控评
  frozenComment = (ids) => {
    Modal.confirm({
      title: '控评评论',
      content: `控评${this.state.selectedRowKeys?.length ? '这些' : '该'}评论吗？违规了就要毫不犹豫！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.frozenComment, {
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

  // 审核通过
  thawComment = (ids) => {
    Modal.confirm({
      title: '审核通过',
      content: `确认${this.state.selectedRowKeys?.length ? '这些' : '该'}评论通过吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(serviceApi.thawComment, {
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
        title: '内容',
        dataIndex: 'content',
        fixed: 'left',
        render: (text, record) => {
          return (
            <MultilineText text={record.content} tooltip rows={1}/>
          );
        }
      },

      {
        title: '状态',
        width: 100,
        dataIndex: 'status',
        render: (text) => {
          return (
            <div>{
              text ? (
                <Badge status="processing" text="正常" />
              ) : (
                <Badge status="error" text="待审核" />
              )}
            </div>
          );
        }
      },
      {
        title: '出处',
        width: 150,
        dataIndex: 'article',
        render: (text, record) => {
          return (
            <a
              href={`/detail/${record?.article?.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <MultilineText text={record?.article?.title} tooltip rows={1}/>
            </a>
          );
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
        width: 150,
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
        title: '类型',
        width: 100,
        dataIndex: 'pid',
        render: (text) => {
          return <span>{text ? '回复评论' : '文章评论'}</span>;
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
                    this.frozenComment([record.id]);
                  }}
                >
                  控评
                </a>
              ) : (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.thawComment([record.id]);
                  }}
                >
                  通过
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
          defaultValue={null}
          onChange={this.typeChange}
          buttonStyle="solid"
        >
          <RadioButton key="all" value={null} style={{ marginBottom: 5 }}>
            全部
          </RadioButton>
          {_.map(dictToArr('commentStatus'), (item) => {
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

  // 切换类型
  typeChange = (e) => {
    let type = e.target.value;
    this.setState({
      type,
      selectedRowKeys: [],
      page: 1
    }, () => {
      this.queryList();
    });
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
          onClick={() => this.frozenComment(selectedRowKeys)}
          disabled={!selectedRowKeys.length}
        >
          批量审核
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          icon={<UnlockOutlined />}
          onClick={() => this.thawComment(selectedRowKeys)}
          disabled={!selectedRowKeys.length}
        >
          批量解控
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
    loading: state.getCommentListLoading
  };
};

const Component = withRouter(connect(stateToProps, null)(CommentManage));
Component.AdminLayout = AdminLayout;

export default Component;
