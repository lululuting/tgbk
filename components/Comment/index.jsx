/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-03-02 10:47:32
 * @LastEditors: TingGe
 * @Description: 评论组件
 * @FilePath: /ting_ge_blog/components/Comment/index.jsx
 */

import React, { useState, useRef } from 'react';
import ReactDom from 'react-dom';
import { Comment, Popover, Avatar, Button, List, Input, message } from 'antd'
import moment from 'moment'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import { isLogin } from '@/public/utils/utils'
import LazyImg from '@/components/LazyImg'
import { connect } from 'react-redux'
import Router from 'next/router'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import {
	SmileOutlined
} from '@ant-design/icons';
import './style.less'

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
		custom: '自定义',
	},
	categorieslabel: '表情类别', // Accessible title for the list of categories
	skintones: {
		1: '默认肤色',
		2: '浅肤色',
		3: '中浅肤色',
		4: '中等肤色',
		5: '中深色肤色',
		6: '深色肤色',
	}
}



// 评论的回复组件（回复评论，不是评论文章）
const ReplyEditor = ({ props, hideRplyEditor, qureyComment }) => {
	const [value, setValue] = useState('')
	const [code, setCode] = useState('')
	const [verifyode, setVerifyCode] = useState('/default/getVerify')

	const inputRef = useRef();

	const onValueChange = (e) => {
		setValue(e.target.value)
	}

	const onCodeChange = (e) => {
		setCode(e.target.value)
	}

	const onSubmit = () => {
		if (!value || !value.trim()) {
			message.warning('评论不能为空！')
			return;
		}

		if (!code || !code.trim()) {
			message.warning('验证码不能为空！')
			return;
		}

		request(serviceApi.setArticleComment, {
			method: 'post',
			credentials: 'include', // 携带cookie
			data: {
				content: value.trim(),
				commentId: props.id,
				code,
			}
		}).then((res) => {
			if (res && res.code == 200) {
				setVerifyCode('/default/getVerify?mt=' + Math.random())
				
				if (res.success) {
					message.success(res.msg)
					hideRplyEditor(false)
					qureyComment();
				}else{
					message.warn(res.msg)
				}
			}
		})
	}

	// 添加表情
	const addEmoji = (e) => {
		//获取光标位置方法
		const getPositionForTextArea = (ctrl) => {
			let CaretPos = {
				start: 0,
				end: 0
			};
			if (ctrl.selectionStart) {// Firefox support
				CaretPos.start = ctrl.selectionStart;
			}
			if (ctrl.selectionEnd) {
				CaretPos.end = ctrl.selectionEnd
			}
			return (CaretPos);
		}
		// 重新定位光标方法
		const setCursorPosition = (ctrl, pos) => {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
		};

		// 插入修改字符串方法
		const insertStr = (soure, start, newStr) => {
			return soure.slice(0, start) + newStr + soure.slice(start);
		}


		const position = getPositionForTextArea(inputRef.current.input);//获取光标位置
		let newValue = insertStr(value, position.start, e.native); // 设置value

		setValue(newValue)

		// 重新定位光标
		setTimeout(() => {
			setCursorPosition(inputRef.current.input, position.start + e.native.length);
		}, 20);

	}

	const selectEmoji = (
		<Popover content={(
			<div className="emoji-box">
				<Picker
					set="apple"
					color="#1890ff"
					theme="auto"
					title='开始你的表演...'
					emoji='point_up'
					onSelect={addEmoji}
					showPreview={false}
					showSkinTones={false}
					i18n={i18n}
					style={{ border: 'none' }}
				/>
			</div>
		)} placement="bottomRight" trigger="click">
			<SmileOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
		</Popover>
	)

	return (
		<div className="reply-editor-box" >
			<Input ref={inputRef} suffix={selectEmoji} placeholder={`回复${props.userName}`} onChange={onValueChange} value={value} />

			<div className="verify-box" style={{marginLeft: 10}}>
				<Input style={{ width: 100 }} placeholder="验证码" onChange={onCodeChange} value={code} />
				<div style={{ position: 'relative', width: 100 }}>
					<LazyImg style={{ width: 100, height: 32, cursor: 'pointer' }} src={verifyode} alt={"看不清？点击刷新"} onClick={() => setVerifyCode('/default/getVerify?mt=' + Math.random())} />
				</div>
			</div>

			<Button className="reply-btn" htmlType="submit" loading={false} onClick={(e) => onSubmit(e)} type="primary" disabled={!value.trim().length}>
				确定
      </Button>
		</div>
	)
}

// 评论内容组件（评论文章）
const ExampleComment = ({ props, qureyComment, children }) => {
	let parent = null; // 节点

	const [replyStatus, setReplyStatus] = useState(false)

	// 回复评论
	const showComment = (e) => {

		// 权限校验
		if (!isLogin()) {
			message.warning('靓仔，请先登录哦！')
			return false
		}
		setReplyStatus(!replyStatus);
		e.persist()
		parent = e.target.parentNode.parentNode.parentNode;

		if (replyStatus) {
			parent.removeChild(parent.lastChild)
		} else {
			let ele = document.createElement("div");//创建一个html标签
			ele.classList = 'reply-editor';
			ReactDom.render(<ReplyEditor hideRplyEditor={hideRplyEditor} props={props} qureyComment={qureyComment} />, ele);
			parent.appendChild(ele);//将标签添加到页面中
		}
	}

	// 给子组件使用的 关闭回复框方法
	const hideRplyEditor = () => {
		setReplyStatus(false)
		parent.removeChild(parent.lastChild)
	}

	// 点赞
	const clickLike = (props) => {

		// 权限校验
		if (!isLogin()) {
			message.warning('靓仔，请先登录哦！')
			return false
		}

		request(serviceApi.commentClickLike, {
			method: 'post',
			data: {
				commentId: props.id,
			}
		}).then((res) => {
			if (res && res.code == 200) {
				message.success(res.msg)
				qureyComment()
			}
		})
	}

	return (
		<Comment
			actions={
				[
					<span key={props.id + 'like'} onClick={() => clickLike(props)}>赞 {props.likeNum && props.likeNum > 0 ? props.likeNum : null} </span>,
					<span key={props.id + 'call'} onClick={(e) => { showComment(e) }}>{replyStatus ? '取消回复' : '回复'}</span>
				]
			}
			author={<a>{props.userName}</a>}
			datetime={moment(props.createTime).fromNow()}
			avatar={
				<Avatar
					src={props.avatar}
					alt="头像"
				/>
			}
			content={
				<p>
					{
						props.content
					}
				</p>
			}
		>
			{children}
		</Comment>
	)
};

// 评论列表
const CommentList = ({ props, comments, qureyComment }) => {

	// 递归下级
	const loop = item => {
		return (
			<ExampleComment key={item.id} props={{ ...item, ...props }} qureyComment={qureyComment}>
				{
					item.children && item.children.length &&
					item.children.map(i => (
						loop(i)
					))
				}
			</ExampleComment>
		)
	}

	return (
		<List
			dataSource={comments}
			header={`评论列表（${comments.length}条评论）`}
			itemLayout="horizontal"
			locale={{ emptyText: "还没有人评论~" }}
			renderItem={item => (
				<>{loop(item)}</>
			)}
		/>
	)
}

// 发布评论组件
const Editor = ({ onValueChange, onCodeChange, setValue, onSubmit, submitting, value, code }) => {
	const textAreaRef = useRef();

	const [verifyode, setVerifyCode] = useState('/default/getVerify')


	// 添加表情
	const addEmoji = (e) => {
		//获取光标位置方法
		const getPositionForTextArea = (ctrl) => {
			let CaretPos = {
				start: 0,
				end: 0
			};
			if (ctrl.selectionStart) {// Firefox support
				CaretPos.start = ctrl.selectionStart;
			}
			if (ctrl.selectionEnd) {
				CaretPos.end = ctrl.selectionEnd
			}
			return (CaretPos);
		}
		// 重新定位光标方法
		const setCursorPosition = (ctrl, pos) => {
			ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
		};

		// 插入修改字符串方法
		const insertStr = (soure, start, newStr) => {
			return soure.slice(0, start) + newStr + soure.slice(start);
		}

		const position = getPositionForTextArea(textAreaRef.current);//获取光标位置
		let newValue = insertStr(value, position.start, e.native); // 设置value

		setValue(newValue)

		// 重新定位光标 不加延时器就会发生光标还没插入文字呢 就已经把光标插入后的位置提前定位
		setTimeout(() => {
			setCursorPosition(textAreaRef.current, position.start + e.native.length);
		}, 20);
	}

	return (
		<div>
			<textarea className="editor-textarea" ref={textAreaRef} placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。" rows={4} onChange={onValueChange} value={value} />
			<div className="action-box">
				<Popover content={(
					<div className="emoji-box">
						<Picker
							set="apple"
							color="#1890ff"
							theme="auto"
							title='开始你的表演...'
							emoji='point_up'
							onSelect={addEmoji}
							showPreview={false}
							showSkinTones={false}
							i18n={i18n}
							style={{ border: 'none' }}
						/>
					</div>
				)} placement="bottomRight" trigger="click">
					<SmileOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
				</Popover>

				<div className="verify-box">
					<Input style={{ width: 100 }} placeholder="验证码" onChange={onCodeChange} value={code} />
					<div style={{ position: 'relative', width: 100 }}>
						<LazyImg style={{ width: 100, height: 32, cursor: 'pointer' }} src={verifyode} alt={"看不清？点击刷新"} onClick={() => setVerifyCode('/default/getVerify?mt=' + Math.random())} />
					</div>
				</div>

				<Button
					loading={submitting}
					onClick={() => {
						// 传入刷新验证码回调
						onSubmit(() => {
							setVerifyCode('/default/getVerify?mt=' + Math.random())
						});
					}}
					type="primary"
				>
					发 布
				</Button>
			</div>

		</div>
	)
};


class CommentComponent extends React.Component {
	state = {
		comments: [], // 评论列表
		value: '', // 评论内容
		code: '', // 验证码
	};

	componentDidMount() {
		this.qureyComment();
	}

	// 查询评论
	qureyComment = () => {
		request(serviceApi.getArticleComment, {
			method: 'get',
			params: {
				id: Router.router.query.id
			}
		}).then((res) => {
			if (res && res.code == 200) {
				let list = this.formatData(res.data)

				this.setState({
					comments: list
				})
			}
		})
	}

	// 评论提交  (refreshCall刷新验证码回调)
	handleSubmit = (refreshCall) => {
		if (!this.state.value || !this.state.value.trim()) {
			message.warning('评论不能为空！')
			return;
		}

		if (!this.state.code || !this.state.code.trim()) {
			message.warning('验证码不能为空！')
			return;
		}

		request(serviceApi.setArticleComment, {
			method: 'post',
			credentials: 'include', // 携带cookie
			data: {
				content: this.state.value.trim(),
				articleId: Router.router.query.id,
				code: this.state.code,
			}
		}).then((res) => {
			if (res && res.code == 200) {
				refreshCall()
				if (res.success) {
					message.success(res.msg)
					this.qureyComment();
					this.setState({
						value: '',
						code: '',
					});
				}else{
					message.warn(res.msg)
				}
			}
		})
	};

	// 老马提供的格式化评论的方法
	formatData = (list) => {
		var toTree = (prevCur, list, level = 3, children = 'children', curLevel = 0) => {
			curLevel++
			const id = typeof prevCur === 'number' || prevCur === null ? prevCur : prevCur.id
			const data = list.reduce((prev, {
				...cur
			}) => {
				if (cur.pid !== id) return prev
				cur[children] = toTree(cur, list, level, children, curLevel)
				prevCur && curLevel >= level && (cur.content = `回复 ${prevCur.userName}：${cur.content}`)
				return [...prev, cur]
			}, [])
			data.sort()
			return data
		}

		/**
		 * 根据树结构设定某级别扁平化
		 * @param {Number} level - 要扁平化级别
		 * @param {Number} curLevel - 当前级别
		 */
		var deep = (list, level = 1, children = 'children', curLevel = 0) => {
			curLevel++
			if (!Array.isArray(list)) return
			list.forEach(e => {
				if (curLevel === level) {
					e[children] = deepFlag(e[children], children)
				} else if (curLevel > level) {
					delete e[children]
					return
				}
				deep(e[children], level, children, curLevel)
			})
			return list
		}

		var deepFlag = (data, children = 'childrens') => {
			return data.reduce((prev, cur) => ([...prev, cur, ...(Array.isArray(cur[children]) && cur[children].length ?
				deepFlag(cur[children], children) : [])]), [])
		}

		return deep(toTree(null, list))
	}

	handleValueChange = e => {
		this.setState({
			value: e.target.value,
		});
	};

	handleCodeChange = e => {
		this.setState({
			code: e.target.value,
		});
	};

	setValue = (value) => {
		this.setState({
			value
		});
	}

	render() {
		const { comments, value, code } = this.state;
		const { userInfo, setArticleCommentLoading, props } = this.props;
		return (
			<div id="comment-box" className="comment-box">
				<Choose>
					<When condition={userInfo}>
						<Comment
							avatar={
								<Avatar
									src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png?imageslim"
									alt="user"
								/>
							}
							content={
								<Editor
									onValueChange={this.handleValueChange}
									onCodeChange={this.handleCodeChange}
									setValue={this.setValue}
									onSubmit={this.handleSubmit}
									submitting={setArticleCommentLoading}
									value={value}
									code={code}
								/>
							}
						/>
					</When>
					<Otherwise>
						<div className="login-tips-box">
							<Avatar
								src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png?imageslim"
								alt="user"
							/>
							<div className="login-tips">秀儿，请登录后再发炎~</div>
						</div>
					</Otherwise>
				</Choose>

				<div className="header-tips">
					<CommentList
						props={{ ...props, uid: userInfo ? userInfo.userId : null, submitting: setArticleCommentLoading }}
						comments={comments}
						qureyComment={this.qureyComment}
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		userInfo: state.userInfo,
		setArticleCommentLoading: state.setArticleCommentLoading
	}
}

export default connect(mapStateToProps)(CommentComponent);