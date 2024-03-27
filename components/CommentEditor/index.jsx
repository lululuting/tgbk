/*
 * @Author: TingGe
 * @LastEditors: TingGe
 * @Description: 评论组件
 * @FilePath: /ting_ge_blog/components/CommentEditor/index.jsx
 */
import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import theStore from 'store';
import { Popover, Avatar, Button, Input, message } from 'antd';
import { Comment } from '@ant-design/compatible';
import LazyImg from '@/components/LazyImg';
import { AntConfigProvider } from '@/pages/_app';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { SmileOutlined } from '@ant-design/icons';
// import SvgIcon from '@/components/SvgIcon';
import { isLogin } from '@/public/utils/utils';
import styles from './style.module.less';


// 表情插件汉化
const i18n = {
  search: '搜索',
  clear: '清除', // Accessible label on "clear" button
  notfound: '木有数据',
  skintext: '选择默认肤色',
  categories: {
    search: '搜索结果',
    recent: '常用',
    smileys: '笑脸',
    people: '情绪和人',
    nature: '动物与自然',
    foods: '食物',
    activity: '活动',
    places: '旅行和地点',
    objects: '物体',
    symbols: '符号',
    flags: '旗帜',
    custom: '自定义'
  },
  categorieslabel: '表情类别', // Accessible title for the list of categories
  skintones: {
    1: '默认肤色',
    2: '浅肤色',
    3: '中浅肤色',
    4: '中等肤色',
    5: '中深色肤色',
    6: '深色肤色'
  }
};

// 插入修改字符串方法
const insertStr = (soure, start, newStr) => {
  return soure.slice(0, start) + newStr + soure.slice(start);
};

// 获取光标位置方法
const getPositionForTextArea = (ctrl) => {
  let CaretPos = {
    start: 0,
    end: 0
  };
  if (ctrl.selectionStart) {
    // Firefox support
    CaretPos.start = ctrl.selectionStart;
  }
  if (ctrl.selectionEnd) {
    CaretPos.end = ctrl.selectionEnd;
  }
  return CaretPos;
};

// 重新定位光标  不加延时器就会发生光标还没插入文字 就已经把光标插入后的位置提前定位
const resetCursorPosition = (ctrl, pos) => {
  setTimeout(() => {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  }, 20);
};

// 添加表情
const addEmoji = ({event, ref, content, setContent}) => {
  const position = getPositionForTextArea(ref); // 获取光标位置
  let newValue = insertStr(content, position.start, event.native); // 设置value
  setContent(newValue);
  // 重新定位光标
  resetCursorPosition(ref, position.start + event.native.length);
};


// 评论的回复组件（回复评论，不是评论文章）
export const ReplyEditor = ({ props, onSubmit }) => {
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('/default/getVerify');

  const inputRef = useRef();

  const getVerifyCode = () => {
    setVerifyCode('/default/getVerify?mt=' + Math.random());
  };

  const selectEmoji = (
    <Popover
      content={
        <div className={styles['emoji-box']}>
          <Picker
            set="apple"
            color="#1890ff"
            theme="auto"
            title="开始你的表演..."
            emoji="point_up"
            onSelect={(e)=> {
              addEmoji({
                event: e,
                ref: inputRef.current.input,
                content,
                setContent
              });
            }}
            showPreview={false}
            showSkinTones={false}
            i18n={i18n}
            style={{ border: 'none' }}
          />
        </div>
      }
      placement="bottomRight"
      trigger="click"
    >
      <SmileOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
    </Popover>
  );


  const replySubmit = () => {
    if (!content || !content.trim()) {
      message.warning('评论不能为空！');
      return;
    }

    if (!code || !code.trim()) {
      message.warning('验证码不能为空！');
      return;
    }
    onSubmit({
      values: {
        content,
        code
      },
      callback: ()=> {
        setContent('');
        setCode('');
        getVerifyCode();
      }
    });
  };

  return (
    <div className={styles['reply-editor-box']}>
      <AntConfigProvider>
        <Input
          ref={inputRef}
          suffix={selectEmoji}
          placeholder={`回复 ${props.userName || props.visitorName + '（网友）'}`}
          onChange={(e)=>setContent(e.target.value)}
          value={content}
        />

        <div className={styles['verify-box']} style={{ marginLeft: 10 }}>
          <Input
            style={{ width: 100 }}
            placeholder="验证码"
            onChange={(e)=>setCode(e.target.value)}
            value={code}
          />
          <div style={{ position: 'relative', width: 100 }}>
            <img
              style={{ width: 100, height: 32, cursor: 'pointer' }}
              src={verifyCode}
              alt={'看不清？点击刷新'}
              onClick={() =>
                setVerifyCode('/default/getVerify?mt=' + Math.random())
              }
            />
          </div>
        </div>

        <Button
        // style={!content.trim() || !code ? {opacity: 0.5} : null}
          className={styles['reply-btn']}
          htmlType="submit"
          loading={false}
          onClick={replySubmit}
          type="primary"
          disabled={!code || !content.trim()}
        >
        发布
        </Button>
      </AntConfigProvider>
    </div>
  );
};


// 发布评论组件
const EditorBox = ({
  content,
  setContent,
  visitorAvatar,
  visitorName,
  setVisitorName,
  onSubmit,
  submitting,
  verifyCode,
  getVerifyCode,
  code,
  setCode
}) => {
  const textAreaRef = useRef();

  const codeComponent = (
    <div className={styles['verify-box']}>
      <Input
        style={{ width: 100, border: 0 }}
        placeholder="验证码"
        onChange={(e)=>setCode(e.target.value)}
        value={code}
      />
      <div style={{ position: 'relative', width: 100 }}>
        <img
          style={{ width: 100, height: 32, cursor: 'pointer' }}
          src={verifyCode}
          alt={'看不清？点击刷新'}
          onClick={() =>
            getVerifyCode()
          }
        />
      </div>
    </div>
  );

  const commentSubmit = () => {
    if (!content || !content.trim()) {
      message.warning('评论不能为空！');
      return;
    }

    if (!code || !code.trim()) {
      message.warning('验证码不能为空！');
      return;
    }

    // 传入刷新验证码回调
    onSubmit({
      values: {
        visitorAvatar,
        visitorName,
        code,
        content
      },
      callback: ()=> {
        setContent('');
        setCode('');
        getVerifyCode();
      }
    });
  };

  return (
    <div className={styles['editor-box']}>

      {
        !isLogin() ? <div className={styles['visitor-info-box']}>
          <Input
            style={{ border: 0, marginRight: 10}}
            placeholder="昵称"
            maxLength={20}
            onChange={(e) => setVisitorName(e.target.value)}
            value={visitorName}
          />
          {codeComponent}
        </div> : null
      }

      <Input.TextArea
        className={styles['editor-textarea']}
        ref={textAreaRef}
        placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"
        autoSize={{ minRows: 2, maxRows: 6 }}
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
      <div className={styles['action-box']}>
        <Popover
          content={
            <div className={styles['emoji-box']}>
              <Picker
                set="apple"
                color="#1890ff"
                theme="auto"
                title="开始你的表演..."
                emoji="point_up"
                onSelect={(e)=> {
                  addEmoji({
                    event: e,
                    ref: textAreaRef.current.resizableTextArea.textArea,
                    content,
                    setContent
                  });
                }}
                showPreview={false}
                showSkinTones={false}
                i18n={i18n}
                style={{ border: 'none' }}
              />
            </div>
          }
          placement="bottomRight"
          trigger="click"
        >
          <SmileOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        </Popover>
        {isLogin() ? codeComponent : null}
        <Button
          loading={submitting}
          // style={(!code || !content) ? {opacity: 0.5, borderRadius: 5 } : {borderRadius: 5}}
          onClick={commentSubmit}
          disabled={!code || !content.trim()}
          type="primary"
        >
          发布
        </Button>
      </div>
    </div>
  );
};

const Editor = (props) => {
  const [visitorAvatar, setVisitorAvatar] = useState(theStore.get('visitorInfo')?.avatar);
  const [visitorName, setVisitorName] = useState(theStore.get('visitorInfo')?.name);
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('/default/getVerify?mt=' + Math.random());


  // 网友头像
  const visitorAvatarArr = [
    'http://cdn.lululuting.com/avatar/Boys_1.png',
    'http://cdn.lululuting.com/avatar/Boys_2.png',
    'http://cdn.lululuting.com/avatar/Boys_3.png',
    'http://cdn.lululuting.com/avatar/Boys_4.png',
    'http://cdn.lululuting.com/avatar/Boys_5.png',
    'http://cdn.lululuting.com/avatar/Boys_6.png',
    'http://cdn.lululuting.com/avatar/Girls_1.png',
    'http://cdn.lululuting.com/avatar/Girls_2.png',
    'http://cdn.lululuting.com/avatar/Girls_3.png',
    'http://cdn.lululuting.com/avatar/Girls_4.png',
    'http://cdn.lululuting.com/avatar/Girls_5.png',
    'http://cdn.lululuting.com/avatar/Girls_6.png',
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png?imageslim'
  ];


  const getVerifyCode = () => {
    setVerifyCode('/default/getVerify?mt=' + Math.random());
  };

  const randomAvatar = () => {
    let src = _.sample(visitorAvatarArr);
    setVisitorAvatar(src);
    theStore.set('visitorInfo', {
      name: visitorName,
      avatar: src
    });
  };

  const setVisitorNameStore = (value) => {
    theStore.set('visitorInfo', {
      name: value,
      avatar: visitorAvatar
    });
  };

  // hooks 使用防抖
  const delayedStore = useRef(_.debounce(value => setVisitorNameStore(value), 500)).current;

  const visitorNameChange = (value)=> {
    setVisitorName(value);
    delayedStore(value);
  };

  useEffect(()=>{
    let visitorInfo = theStore.get('visitorInfo');
    if (!props?.userInfo && !visitorInfo) {
      randomAvatar();
    }
  }, []);

  return (
    <div className={styles['comment-editor']}>
      <Comment
        avatar={
          <Avatar
            size={56}
            src={
              props?.userInfo?.avatar || visitorAvatar
            }
            onClick={!isLogin() ? randomAvatar : ()=>{}}
            alt="userAvatar"
          />
        }
        content={
          <EditorBox
            {...props}
            visitorAvatar={visitorAvatar}
            visitorName={visitorName}
            setVisitorName={visitorNameChange}
            content={content}
            setContent={(e) => {setContent(e);}}
            verifyCode={verifyCode}
            getVerifyCode={getVerifyCode}
            code={code}
            setCode={(e)=>setCode(e)}
          />
        }
      />
    </div>
  );
};
export default Editor;
