/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-06-06 11:01:19
 * @LastEditors: TingGe
 * @Description: 通用列表组件 （后面越改越复杂 早知道就不用antd的list了，算了不想改了就这样吧）
 * @FilePath: /ting_ge_blog/components/ArticleList/index.jsx
 */

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { List, Modal, Button, Divider, message } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import { dict } from '@/public/utils/dict';
import { LikeOutlined, FireOutlined } from '@ant-design/icons';
import { baseBatch } from '@/public/utils/baseRequest';
import serviceApi from '@/config/service';
import LazyImg from '../LazyImg';
import MultilineText from '../MultilineText';
import styles from './style.module.less';

moment.locale('zh-cn');

// 搜索高亮
const searchHighlight = (title, searchValue) => {
  return (
    <a
      dangerouslySetInnerHTML={{
        __html: title.replace(
          new RegExp(searchValue, 'g'),
          `<i class='hot-str'>${searchValue}</i>`
        )
      }}
    />
  );
};

// 前往用户中心
const linkUserCenter = (e, id) => {
  e.stopPropagation();
  Router.push('/userCenter[id]', `/userCenter/${id}`);
};

const ArticleList = (props) => {

  // 删除
  const delItem = (id) => {
    Modal.confirm({
      title: '删除文章？',
      content: '是否删除该文章？删除后无法找回，请谨慎操作！',
      onOk: () => {
        baseBatch(serviceApi.delArticle, {
          ids: [id]
        }).then((res) => {
          if (res?.code === 200) {
            message.success(res.msg);
            if (props.callBack) {
              props.callBack();
            }
          }
        });
      }
    });
  };
  const apply = () => {
    Modal.confirm({
      title: '申诉文章？',
      content: '对违规文章进行申诉，通知管理员审查。',
      onOk: () => {
        // todo：暂时不做这个功能
        setTimeout(()=> {
          message.success('管理员表示收到🫡！');
        }, 2000);
      }
    });
  };

  return (
    <div className={styles['article-list']}>
      <List
        dataSource={props.data}
        split={false}
        locale={{ emptyText: 'ㄟ( ▔, ▔ )ㄏ 暂无数据' }}
        itemLayout="vertical"
        loading={props.loading}
        loadMore={
          props?.data?.length >= (props?.limit || 5) ? (
            props.loadMore && !props.isNoData ? (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Button
                  shape="round"
                  loading={props.loading}
                  className={'load-more-btn'}
                  onClick={() => props.loadMore()}
                >
                  加载更多
                </Button>
              </div>
            ) : (
              <div className={classNames(styles['bottom-tips'])}>
                <Divider>暂时只有这么多了</Divider>
              </div>
            )
          ) : null
        }
        renderItem={(item) => (
          <List.Item
            className={classNames(
              styles['article-item-box'],
              {'disabled': item.status === _.get(dict, 'articleStatus.no')},
              {'frozen': item.state === _.get(dict, 'articleState.no')}
            )}
            key={item.id}
            actions={[
              // eslint-disable-next-line react/jsx-key
              <span className={classNames(styles['flex-center'])}>
                <FireOutlined style={{ marginRight: 8 }} />
                {item.viewCount}
              </span>,
              // eslint-disable-next-line react/jsx-key
              <span className={classNames(styles['flex-center'])}>
                <LikeOutlined style={{ marginRight: 8 }} />
                {item.likeCount}
              </span>,
              // eslint-disable-next-line react/jsx-key
              <span onClick={(e) => linkUserCenter(e, item.userId)}>
                {item?.user?.userName}
              </span>,
              // eslint-disable-next-line react/jsx-key
              <span>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</span>
            ]}
            extra={
              <Link href="/detail/[id]" as={`/detail/${item.id}`}>
                <a className={classNames(styles['item-img'])}>
                  <LazyImg
                    src={item.cover}
                    alt={item.title}
                    width={260}
                    height={165}
                  />
                </a>
              </Link>
            }
          >
            <List.Item.Meta
              style={props.isEdit ? {paddingRight: 70} : null}
              title={
                <>
                  {props.typeTag ? (
                    <span className={styles['item-type']}>{item?.type?.typeName}</span>
                  ) : null}
                  <Link href="/detail/[id]" as={`/detail/${item.id}`}>
                    {props.search ? (
                      searchHighlight(item.title, props.search)
                    ) : (
                      <a className={styles['article-name']}>
                        <MultilineText text={item.title} rows={1}/>
                      </a>
                    )}
                  </Link>
                </>
              }
              description={
                <ul className={styles['item-tag-list']}>
                  {!_.isEmpty(item.tags.split(',')) && _.map(item.tags.split(','), (item, index) => {
                    return (
                      <li className={styles['item-tag']} key={index}>
                        <span># </span>
                        {item}
                      </li>
                    );
                  })}
                </ul>
              }
            />
            <div className={styles['item-introduce']}>
              <Link href="/detail/[id]" as={`/detail/${item.id}`}>
                <a>
                  <MultilineText text={item.introduce} />
                </a>
              </Link>
            </div>

            {
              props.isEdit ? (
                <div className={styles['item-action-box']}>
                  {
                    item.state === _.get(dict, 'articleState.yes')
                      ? (
                        <a
                          className={classNames(styles['action-btn'],styles['primary-btn'])}
                          href={`/articleEdit/${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                         编辑
                        </a>
                      ) : null
                  }

                  {
                    item.state === _.get(dict, 'articleState.no')
                      ?  (
                        <a onClick={()=>apply(item.id)} className={classNames(styles['action-btn'], styles['apply-btn'])}>
                          申诉
                        </a>
                      )
                      : null
                  }


                  <a className={classNames(styles['action-btn'], styles['del-btn'])} onClick={()=>delItem(item.id)}>删除</a>
                </div>
              )
                : null
            }


            {
              props.isEdit ? (
                <div className={styles['status-box']}>
                  {
                    item.status === _.get(dict, 'articleStatus.no')
                      ? <span className={styles['disabled']}>隐藏</span> : null
                  }

                  {
                    item.state === _.get(dict, 'articleState.no')
                      ? <span className={styles['frozen']}>冻结</span> : null
                  }
                </div>
              )
                : null
            }

          </List.Item>
        )}
      />
    </div>
  );
};

ArticleList.propTypes = {
  data: PropTypes.array,
  typeTag: PropTypes.bool,
  loading: PropTypes.bool,
  isNoData: PropTypes.bool,
  isEdit: PropTypes.bool,
  search: PropTypes.string,
  callBack: PropTypes.func
};

export default ArticleList;
