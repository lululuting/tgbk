/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-05-04 01:14:51
 * @FilePath: /ting_ge_blog/components/AdminLayout/index.jsx
 */
import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import styles from './style.module.less';
const { SubMenu } = Menu;
export default class Admin extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    // console.log('父 componentDidMount');
  }

  render () {
    return (
      <div className={styles['admin-layout']}>
        <div className={styles['left-menu']}>
          <Menu
            onClick={this.handleClick}
            style={{ width: 220 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['1', '2', '3', '5']}
            mode="inline"
          >
            <SubMenu
              key="1"
              icon={
                <><SvgIcon name="iconxitongshezhi"/></>
              }
              title="网站管理"
            >
              <Menu.Item
                icon={
                  <><SvgIcon name="icontupian"/></>
                }
              >
                <Link href="/admin/banner">
                  <a>轮播管理</a>
                </Link>
              </Menu.Item>
              <Menu.Item
                icon={
                  <><SvgIcon name="icongonggao"/></>
                }
              >
                <Link href="/admin/notice">
                  <a>公告管理</a>
                </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="2"
              icon={
                <><SvgIcon name="iconzixun"/></>
              }
              title="内容管理"
            >
              <Menu.Item
                icon={
                  <><SvgIcon name="iconrizhi"/></>
                }
              >
                <Link href="/admin/article">
                  <a>文章管理</a>
                </Link>
              </Menu.Item>
              <Menu.Item
                icon={
                  <><SvgIcon name="iconxiaoxi"/></>
                }
              >
                <Link href="/admin/comment">
                  <a>评论管理</a>
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="3"
              icon={
                <><SvgIcon name="icontuandui"/></>
              }
            >
              <Link href="/admin/user">
                <a>用户管理</a>
              </Link>
            </Menu.Item>
            <Menu.Item
              key={4}
              icon={
                <><SvgIcon name="iconshezhi"/></>
              }
            >
              <Link href="/admin/function">
                <a>功能配置</a>
              </Link>
            </Menu.Item>
          </Menu>
        </div>

        <div style={{ flex: 1 }}>{this.props.children}</div>
      </div>
    );
  }
}
