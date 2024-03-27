/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2022-12-20 15:15:59
 * @LastEditors: TingGe
 * @Description: 用户展示组件
 * @FilePath: /ting_ge_blog/components/UpInfo/index.jsx
 */

import React from 'react';
import _ from 'lodash';
import { Avatar, Card, Divider } from 'antd';
import classnames from 'classnames';
import Link from 'next/link';
import Contact from '@/components/Contact';
import SvgIcon from '@/components/SvgIcon';
import styles from './style.module.less';

const UpInfo = ({ data, link, children }) => {
  return (
    <Card
      className={classnames(styles['up-info'])}
      bordered={false}
      bodyStyle={{ padding: 0 }}
    >
      {link ? (
        <>
          <Link href="/userCenter/[id]" as={`/userCenter/${data.id}`}>
            <a className={styles['user-avatar-box']}>
              <Avatar size={100} src={data.avatar + '?imageslim'}></Avatar>
            </a>
          </Link>
          <Link href="/userCenter/[id]" as={`/userCenter/${data.id}`}>
            <a>
              <p className={styles['up-name']}>{data.userName}</p>
            </a>
          </Link>
        </>
      ) : (
        <>
          <Avatar size={100} src={data.avatar + '?imageslim'}></Avatar>
          <p className={styles['up-name']}>{data.userName}</p>
        </>
      )}

      <p className={styles['up-autograph']}>{data.autograph}</p>

      {data?.post ? (
        <p className={styles['up-post']}>
          <SvgIcon name="iconbangong"/>
          {data.post}
        </p>
      ) : null}

      {data?.address ? (
        <p className={styles['up-address']}>
          <SvgIcon name="icondingwei"/>
          {data.address}
        </p>
      ) : null}

      {!_.isEmpty(data?.tags) ? (
        <div className={styles['up-tags']}>
          <SvgIcon name="iconbiaoqian"/>
          <div>
            {_.map(data.tags.split(','), (item, index) => {
              return <span className={styles['tag-item']} key={index}>
                {item}
              </span>;
            })}
          </div>
        </div>
      ) : null}

      {!_.isEmpty(data?.contact) ? (
        <>
          <Divider>联系方式</Divider>
          <div style={{ paddingBottom: 20 }}>
            <Contact value={data.contact} isEdit={false} />
          </div>
        </>
      ) : null}
      {children}
    </Card>
  );
};

export default UpInfo;
