/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-05-14 14:05:48
 * @FilePath: /ting_ge_blog/pages/admin/function/index.jsx
 */
import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import AdminLayout from '@/components/AdminLayout';
import MultilineText from '@/components/MultilineText';
import serviceApi from '@/config/service';
import request from '@/public/utils/request';
import {
  message,
  Spin,
  Avatar,
  Switch,
  Card,
  Col,
  Row
} from 'antd';
import _ from 'lodash';
import { getIsLogin } from '@/public/utils/utils';
import BasePage from '../basePage';


class FunctionManage extends BasePage {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modelName: '功能',
      orderBy: null
    });
  }

  queryList = async () => {
    return request(serviceApi.getFunctionList).then((res) => {
      this.setState({
        dataSource: res?.data || []
      });
    });
  };

  setFunction = (checked, id) =>{
    request(serviceApi.setFunction, {
      method: 'post',
      data: {
        id,
        status: checked * 1
      }
    }).then((res) => {
      if (res?.code === 200) {
        message.success(res.msg);
        this.queryList();
      }
    });
  };

  renderTable = () => {
    const { dataSource } = this.state;
    const { loading } = this.props;
    return (
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {
            _.map(dataSource, (item)=> {
              return (
                <Col md={8}>
                  <Card>
                    <Card.Meta
                      avatar={<Avatar src={item.icon} />}
                      title={(
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>{item.name}</div>
                          <Switch checked={item.status} onClick={(checked)=>this.setFunction(checked, item.id)}/>
                        </div>
                      )}
                      description={(<MultilineText text={item.introduce} />)}
                    />
                  </Card>
                </Col>

              );
            })
          }
        </Row>
      </Spin>
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
    loading: state.getFunctionListLoading || state.setFunctionLoading
  };
};

const Component = withRouter(connect(stateToProps, null)(FunctionManage));
Component.AdminLayout = AdminLayout;

export default Component;
