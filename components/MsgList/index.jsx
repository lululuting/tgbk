/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-04-03 18:32:29
 * @LastEditors: TingGe
 * @Description: 消息列表组件
 * @FilePath: /ting_ge_blog/components/MsgList/index.jsx
 */

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import moment from 'moment';
import { Avatar, message } from 'antd';
import LazyImg from '@/components/LazyImg';
import { DeleteOutlined } from '@ant-design/icons';
import MultilineText from '../MultilineText';
import styles from './style.module.less';

moment.locale('zh-cn');

const MsgList = ({ data }) => {
  const filterType = (key) => {
    switch (key) {
    case 1:
      return '评论了你的文章';
    case 2:
      return '回复了你的评论';
    case 3:
      return '点赞了你的文章';
    case 4:
      return '点赞了你的评论';
    case 5:
      return '关注了你';
    case 6:
      return '系统通知';
    default:
      '出bug啦';
      break;
    }
  };

  // 删除通知
  const delMsg = (e) => {
    e.stopPropagation();
    message.warning('删除消息，后续再做！');
  };

  // 跳转
  const detailLink = (e, props) => {
    e.stopPropagation();
    if (props.type * 1 === 5) {
      Router.push('/userCenter[id]', `/userCenter/${props.sourceId}`);
    } else {
      Router.push('/detail[id]', `/detail/${props.sourceId}`);
    }
  };

  // 用户跳转
  const linkUser = (e, props) => {
    e.stopPropagation();
    if (props?.user?.id) {
      Router.push('/userCenter[id]', `/userCenter/${props?.user?.id}`);
    }
  };

  const msgItem = (props) => {
    return (
      <div
        key={props.id}
        className={styles['msg-item']}
        onClick={(e) => detailLink(e, props)}
      >
        <div className={styles['left-box']} onClick={(e) => linkUser(e, props)}>
          <Avatar style={{ marginRight: 20 }} size={46} src={props?.user?.avatar  || props?.comment?.visitorAvatar} />
        </div>

        <div className={styles['right-box']}>
          <div className={styles['text-box']}>
            <div className={styles['msg-content']}>
              <div className={styles['title']}>
                <a onClick={(e) => linkUser(e, props)} className={styles['user-name']}>
                  {props?.user?.userName || props?.comment?.visitorName + '（网友）'}
                </a>
                {filterType(props.type)}
              </div>
              <div className={styles['content']}>
                <MultilineText text={props.content} />
              </div>
            </div>
            <div className={styles['action-box']}>
              <span className={styles['time']}>
                {moment(props.createTime).format('YYYY-MM-DD HH:mm')}
              </span>
              <span onClick={(e) => delMsg(e, props.id)} className={styles['action']}>
                <DeleteOutlined /> 删除该消息
              </span>
            </div>
          </div>

          <div className={styles['source']}>
            {props.type === 1 || props.type === 3 ? (
              <LazyImg
                background
                params="?imageslim"
                src={props?.source || null}
              />
            ) : (
              <MultilineText rows={4} text={props.source}/>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles['msg-list']}>
      {data && data.length ? (
        data.map((item) => msgItem(item))
      ) : (
        <div className={'ant-list-empty-text'}>ㄟ( ▔, ▔ )ㄏ 暂无数据</div>
      )}
    </div>
  );
};

MsgList.propTypes = {
  data: PropTypes.array
};

export default MsgList;
