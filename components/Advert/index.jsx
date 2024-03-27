/*
 * @Date: 2020-04-13 16:05:15
 * @LastEditors: TingGe
 * @LastEditTime: 2023-06-06 17:37:27
 * @FilePath: /ting_ge_blog/components/Advert/index.jsx
 * 插件具体详情 https://aplayer.js.org/#/zh-Hans/
 */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Card } from 'antd';
import { dict } from '@/public/utils/dict';
import { baseQueryList } from '@/public/utils/baseRequest';
import serviceApi from '@/config/service';
import SvgIcon from '@/components/SvgIcon';
import LazyImg from '@/components/LazyImg';
import styles from './style.module.less';

const Aplayer = (props) => {
  const [data, setData] = useState(props.data || []);

  useEffect(() => {
    //  如果没有传值 就来就自己去拿
    if (!props.data) {
      baseQueryList(serviceApi.getBannerList, {
        filters: {
          type: _.get(dict, 'bannerType.advertisement'),
          status: _.get(dict, 'commonStatus.yes')
        },
        orderBy: [
          ['status', 'desc'],
          ['id', 'desc']
        ]
      }).then((res) => {
        setData(res?.data?.list || []);
      });
    }
  }, []);

  return <div style={props.style}>
    {_.map(data, (item, index) => {
      return (
        <Card
          style={index !== 0 ? {  marginTop: 24} : null}
          bordered={false}
          className={styles['advert']}
          key={item.id}
        >
          <p className={styles['title']}>
            <SvgIcon name="iconfaxian" />
            {item.title}
          </p>
          <a
            href={item.link}
            className={styles['content']}
          >
            <LazyImg src={item.url} width={500} height={700} params="?imageslim" />
            
          </a>
        </Card>
      );
    })}
  </div>;
};

export default Aplayer;
