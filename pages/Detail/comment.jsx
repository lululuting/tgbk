/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-01-17 14:46:11
 * @LastEditors: TingGe
 * @Description: 评论组件
 * @FilePath: /ting_ge_blog/pages/detail/comment.jsx
 */

import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Avatar, List, message } from 'antd';
import { Comment } from '@ant-design/compatible';
import moment from 'moment';
import request from '@/public/utils/request';
import theStore from 'store';
import serviceApi from '@/config/service';
import { isLogin } from '@/public/utils/utils';
import CommentEditor, { ReplyEditor } from '@/components/CommentEditor';
import { connect } from 'react-redux';
import Router from 'next/router';
import 'emoji-mart/css/emoji-mart.css';
import { baseQueryList } from '@/public/utils/baseRequest';
import styles from './comment.module.less';
import _ from 'lodash';

// 评论的内容（评论文章）
const ExampleComment = ({ props, queryComment, children }) => {
  let parent = null; // 节点

  const [replyStatus, setReplyStatus] = useState(false);

  // 给子组件使用的 关闭回复框方法
  const hideReplyEditor = () => {
    setReplyStatus(false);
    parent.removeChild(parent.lastChild);
  };


  const onSubmit = ({values, callback}) => {

    const { avatar, name } = theStore.get('visitorInfo');

    if (!isLogin()) {
      if (!avatar || !name) {
        message.warn('网友请先设置头像和昵称');
        return;
      }
    }

    request(serviceApi.setArticleComment, {
      method: 'post',
      data: {
        visitorAvatar: avatar,
        visitorName: name,
        content: values.content,
        commentId: props.id,
        code: values.code
      }
    }).then((res) => {
      if (res?.code === 200) {
        callback();
        if (res.success) {
          message.success(res.msg);
          hideReplyEditor(false);
          queryComment();
        } else {
          message.warn(res.msg);
        }
      }
    });
  };

  // 回复评论
  const showComment = (e) => {
    // 权限校验
    // if (!isLogin()) {
    //   message.warning('网友暂不提供回复评论功能，请先登录哦！');
    //   return false;
    // }
    setReplyStatus(!replyStatus);
    e.persist();
    parent = e.target.parentNode.parentNode.parentNode;

    if (replyStatus) {
      parent.removeChild(parent.lastChild);
    } else {
      let ele = document.createElement('div'); // 创建一个html标签
      ele.classList = 'reply-editor';
      ReactDom.render(
        <ReplyEditor
          props={props}
          onSubmit={onSubmit}
        />,
        ele
      );
      parent.appendChild(ele); // 将标签添加到页面中
    }
  };

  // 点赞
  const clickLike = (props) => {
    // 权限校验
    if (!isLogin()) {
      message.warning('游客暂不开放点赞功能，请先登录！');
      return false;
    }

    request(serviceApi.commentClickLike, {
      method: 'post',
      data: {
        commentId: props.id
      }
    }).then((res) => {
      if (res?.code === 200) {
        message.success(res.msg);
        queryComment();
      }
    });
  };

  const getEquipmentInfo = () => {
    return JSON.parse(props.equipmentInfo);
  };

  return (
    <Comment
      actions={[
        <span key={props.id + 'like'} onClick={() => clickLike(props)}>
          赞 {props?.likeCount || null}
        </span>,
        <span
          key={props.id + 'call'}
          onClick={(e) => {
            showComment(e);
          }}
        >
          {replyStatus ? '取消回复' : '回复'}
        </span>
      ]}
      author={<a className={styles['authorName']}>{props.userName || props.visitorName + '（网友）'}</a>}
      datetime={
        <div className={styles['comment-info']}>
          <span style={{ marginRight: 20}}>{moment(props.createTime).fromNow()}</span>
          {
            _.get(getEquipmentInfo(), 'position.content.address') ? <span style={{ marginRight: 10}}>{_.get(getEquipmentInfo(), 'position.content.address')}</span> : null
          }
          {
            _.get(getEquipmentInfo(), 'userAgent.os.name') ? <span style={{ marginRight: 10}}>{_.get(getEquipmentInfo(), 'userAgent.os.name')}</span> : null
          }
          {
            _.get(getEquipmentInfo(), 'userAgent.client.name') ? <span style={{ marginRight: 10}}>{_.get(getEquipmentInfo(), 'userAgent.client.name')}</span> : null
          }
        </div>}
      avatar={<Avatar src={props.avatar || props.visitorAvatar} alt="头像" />}
      content={<p>{props.content}</p>}
    >
      {children}
    </Comment>
  );
};

// 评论列表
const CommentList = ({ props, comments, queryComment }) => {
  // 递归下级
  const loop = (item) => {
    return (
      <ExampleComment
        key={item.id}
        props={{ ...item, ...props }}
        queryComment={queryComment}
      >
        {item.children &&
          item.children.length &&
          item.children.map((i) => loop(i))}
      </ExampleComment>
    );
  };

  return (
    <List
      dataSource={comments}
      header={`评论列表（${comments.length}条评论）`}
      itemLayout="horizontal"
      locale={{ emptyText: '还没有人评论~' }}
      renderItem={(item) => <>{loop(item)}</>}
    />
  );
};


class CommentComponent extends React.Component {
  state = {
    comments: [] // 评论列表
  };

  componentDidMount () {
    this.queryComment();
  }

  // 查询评论
  queryComment = () => {
    baseQueryList(serviceApi.getArticleComment, {
      filters: {
        id: Router.router.query.id
      },
      page: 1,
      limit: 5
    }).then((res) => {
      if (res?.code === 200) {
        let list = res?.data?.list ? this.formatData(res.data.list) : [];
        this.setState({
          comments: list
        });
      }
    });
  };

  // 评论提交  (refreshCall刷新验证码回调)
  handleSubmit = ({ values, callback}) => {
    const data = {
      ...values,
      articleId: Router.router.query.id
    };

    request(serviceApi.setArticleComment, {
      method: 'post',
      data
    }).then((res) => {
      if (res?.code === 200) {
        callback();
        if (res.success) {
          message.success(res.msg);
          this.queryComment();
          this.setState({
            value: '',
            code: ''
          });
        } else {
          message.warning(res.msg);
        }
      }
    });
  };

  // 格式化评论的方法
  formatData = (list) => {
    let toTree = (
      prevCur,
      list,
      level = 3,
      children = 'children',
      curLevel = 0
    ) => {
      curLevel++;
      const id = typeof prevCur === 'number' || prevCur === null ? prevCur : prevCur.id;
      const data = list.reduce((prev, { ...cur }) => {
        if (cur.pid !== id) return prev;
        cur[children] = toTree(cur, list, level, children, curLevel);
        prevCur &&
          curLevel >= level &&
          (cur.content = `回复 ${prevCur.userName || prevCur.visitorName}：${cur.content}`);
        return [...prev, cur];
      }, []);
      data.sort();
      return data;
    };

    let deepFlag = (data, children = 'childrens') => {
      return data.reduce(
        (prev, cur) => [
          ...prev,
          cur,
          ...(Array.isArray(cur[children]) && cur[children].length
            ? deepFlag(cur[children], children)
            : [])
        ],
        []
      );
    };

    /**
     * 根据树结构设定某级别扁平化
     * @param {Number} level - 要扁平化级别
     * @param {Number} curLevel - 当前级别
     */
    let deep = (list, level = 1, children = 'children', curLevel = 0) => {
      curLevel++;
      if (!Array.isArray(list)) return;
      list.forEach((e) => {
        if (curLevel === level) {
          e[children] = deepFlag(e[children], children);
        } else if (curLevel > level) {
          delete e[children];
          return;
        }
        deep(e[children], level, children, curLevel);
      });
      return list;
    };

    return deep(toTree(null, list));
  };

  render () {
    const { comments } = this.state;
    const { userInfo, setArticleCommentLoading, props } = this.props;
    return (
      <div className={styles['comment-box']}>
        <div className={styles['comment-header']}>
          <div className={styles['comment-header-left']}>
            <h2 className={styles['comment-header-title']}>评论须知</h2>
            <h3 className={styles['comment-header-desc']}>
              <div>* {!isLogin() ? <>网友建议<span data-modal-id="modal_login" className={styles['btn']}>登录</span>后，再留言。 </> : null}所有留言均需审核后再显示。</div>
              <div>* 评论将会收集和使用您的相关信息，网络身份标识（浏览器UA、IP），个人位置（定位、经纬度）。</div>
              <div>* 请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。</div>
            </h3>
          </div>
          <div className={styles['right-box']}>
          </div>
        </div>

        <CommentEditor
          onSubmit={this.handleSubmit}
          userInfo={userInfo}
          submitting={setArticleCommentLoading}
        />

        <div className={styles['header-tips']}>
          <CommentList
            props={{
              ...props,
              uid: userInfo ? userInfo.userId : null,
              submitting: setArticleCommentLoading
            }}
            comments={comments}
            queryComment={this.queryComment}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    userInfo: state.userInfo,
    setArticleCommentLoading: state.setArticleCommentLoading
  };
}

export default connect(mapStateToProps)(CommentComponent);
