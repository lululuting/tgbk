/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2023-04-04 11:03:39
 * @Description: 后管页面的基类，提供默认的 查询 删除 分页 之类的功能。
 * @FilePath: /ting_ge_blog/pages/admin/basePage.js
 */
import React from 'react';
import { baseQueryList, baseBatch } from '@/public/utils/baseRequest';
import serviceApi from '@/config/service';
import {
  Card,
  Modal,
  message,
  Table
} from 'antd';
import _ from 'lodash';
import styles  from './style.module.less';

class BaseManage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modelName: 'xx管理', // 模块名字
      selectedRowKeys: [],
      queryListUrl: serviceApi.getArticleList, // 查询api
      delListUrl: serviceApi.delArticle, // 删除api
      dataSource: {},
      page: 1,
      limit: 10,
      type: null, // 当前选择的type
      filters: null, // 筛选条件 明确就传对象, 不明确 改用 getListFilters 方法
      // 排序方式 二维数组  [['status', 'desc']]
      orderBy: []
    };
  }

  componentDidMount () {
    this.childrenDidMount();
    this.queryList();
  }

  // 子类componentDidMount
  childrenDidMount = () => {};

  // 列表筛选条件（不明确时使用）
  getListFilters = () => {
    return {};
  };

  /**
   * 搜索列表方法
   * @description: 公用搜索列表
   * @param { requestData }
   * @return: dataSource
   */
  queryList = async (requestData) => {
    const { filters, page, limit, orderBy, queryListUrl } = this.state;
    return baseQueryList(queryListUrl, {
      filters: filters || this.getListFilters(),
      page,
      limit,
      orderBy,
      ...requestData
    }).then((res) => {
      this.setState({
        dataSource: this.filterQueryListData(res?.data)
      });
    });
  };

  // 过滤值方法
  filterQueryListData = (data) => {
    return data;
  };

  /**
   * 删除列表方法
   * @description: 公用删除列表
   * @param { ids }
   * @return:
   */
  delList = (ids) => {
    Modal.confirm({
      title: `删除${this.state.modelName}`,
      content: `删除${this.state.selectedRowKeys?.length ? '这些' : '该'}${this.state.modelName}吗？，删了就没了！`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        baseBatch(this.state.delListUrl, {
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

  // 切换类型
  typeChange = (e) => {
    let type = e.target.value === 0 ? null : e.target.value;
    this.setState({
      type,
      selectedRowKeys: [],
      page: 1
    }, () => {
      this.queryList();
    });
  };

  // 重置
  reset = () => {
    this.setState({ selectedRowKeys: [] });
  };

  getListLoading = () => {
    return this.props.listLoading || false;
  };

  getTableColumns = () => {
    return [];
  };

  getRowSelection = () => {
    return {
      fixed: true,
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys
        });
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        name: record.name
      })
    };
  };

  getPaginationTotal = () => {
    return _.get(this.state.dataSource, 'total', 0);
  };

  getPaginationProps = () => {
    const { page, limit } = this.state;
    return {
      showSizeChanger: true,
      showQuickJumper: true,
      current: page,
      pageSize: limit,
      total: this.getPaginationTotal(),
      onChange: (page, limit) => {
        this.setState({
          page,
          limit
        });
        this.queryList({ page, limit });
      }
    };
  };

  renderExtraContent = () => {
    return null;
  };

  renderActionBox = () => {
    return (
      <>
        <div className={styles['left-box']}>{this.renderActionBoxLeft() ? this.renderActionBoxLeft() : null}</div>
        <div className={styles['right-box']}>
          {this.renderActionBoxRight() ? this.renderActionBoxRight() : null}
        </div>
      </>
    );
  };

  renderActionBoxLeft = () => {
    return null;
  };

  renderActionBoxRight = () => {
    return null;
  };

  // 其他组件
  renderOther = () => {
    return null;
  };

  renderTable = () => {
    const { dataSource, page, limit } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: page,
      pageSize: limit,
      total: _.get(dataSource, 'total', 0),
      onChange: (page, limit) => {
        this.setState({
          page,
          limit
        });
        this.queryList({ page, limit });
      }
    };
    return (
      <div style={{marginTop: 24}}>
        <Table
          key={this.getListLoading()}
          rowSelection={this.getRowSelection()}
          columns={this.getTableColumns()}
          dataSource={_.get(dataSource, 'list', [])}
          pagination={paginationProps}
          loading={this.getListLoading()}
          scroll={{ x: 1000 }}
          rowKey="id"
        />
      </div>

    );
  };

  render () {
    const { modelName } = this.state;
    return (
      <div className={styles['base-manage']}>
        <Card
          title={`${modelName}列表`}
          bordered={false}
          className={styles['list-card']}
          extra={this.renderExtraContent()}
        >
          {
            this.renderActionBox() ? <div className={styles['action-box']}>{this.renderActionBox()}</div> : null
          }

          {
            this.renderTable()
          }


        </Card>
        {this.renderOther()}
      </div>
    );
  }
}

export default BaseManage;
