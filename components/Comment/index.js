import React, {useState} from 'react';
import ReactDom from 'react-dom';
import { Comment, Avatar, Form, Button, List, Input, message } from 'antd'
import moment from 'moment'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import './style.less'
import { isLogin, toTreeData } from '@/public/utils/utils'
import { connect } from 'react-redux'
import Router from 'next/router'

const { TextArea } = Input;

// 评论回复组件
const ReplyEditor = ({ props, hideRplyEditor, qureyComment }) => {
	const [value, setValue] = useState('')

	const onChange = (e) => {
		setValue(e.target.value)
	}

	const onSubmit = (e) => {
		if (!value || !value.trim()) {
			message.warning('评论不能为空！')
			return;
		}

		request(serviceApi.setArticleComment, {
			method: 'post',
			data: {
				content: value.trim(),
				commentId: props.id
			}
		}).then((res)=>{
			if(res.code == 200){
				message.success(res.msg)
				hideRplyEditor(false)
				qureyComment();
			}
		})
	}

	return (
		<div className="reply-editor-box" >
			<Input placeholder={`回复${props.userName}`} onChange={onChange} value={value} />
			<Button className="reply-btn" htmlType="submit" loading={false} onClick={(e) => onSubmit(e)} type="primary" disabled={!value.trim().length}>
				确定
            </Button>
		</div>
	)
}

// 评论内容组件
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
			data:{
				commentId:  props.id,
			}
		}).then((res)=>{
			if(res.code == 200){
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
					{props.content}
				</p>
			}
		>
			{children}
		</Comment>
	)
};

// 评论列表
const CommentList = ({ props, comments, qureyComment}) => {

	// 递归下级
	const loop = item => {
		return(
			<ExampleComment key={item.id} props={{...item, ...props}} qureyComment={qureyComment} >
				{
					item.children && item.children.length  &&
					item.children.map(i => (
						loop(i)
					))
				}
			</ExampleComment>
		)
	}

	return(
		<List
			dataSource={comments}
			header={`评论列表（${comments.length}条评论）`}
			itemLayout="horizontal"
			locale={{ emptyText: "还没有人评论~" }}
			renderItem={item =>(
				<div>
					{
						loop(item)
					}
				</div>
			)}
		/>
	)
}

// 发布评论组件
const Editor = ({ onChange, onSubmit, submitting, value }) => (
	<div>
		<Form.Item>
			<TextArea placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。" rows={4} onChange={onChange} value={value} />
		</Form.Item>
		<Form.Item>
			<Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
				发布
      		</Button>
		</Form.Item>
	</div>
);


class CommentComponent extends React.Component {
	state = {
		comments: [],
		value: '',
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
			if (res.code == 200) {
				let list = toTreeData(res.data, null)

				this.setState({
					comments: list
				})
			}
		})
	}

	// 评论提交
	handleSubmit = () => {
		if (!this.state.value || !this.state.value.trim()) {
			message.warning('评论不能为空！')
			return;
		}

		request(serviceApi.setArticleComment, {
			method: 'post',
			data: {
				content: this.state.value,
				articleId: Router.router.query.id,
			}
		}).then((res)=>{
			if(res.code == 200){
				message.success(res.msg)
				this.qureyComment();

				this.setState({
					value: '',
				});
			}
		})
	};

	handleChange = e => {
		this.setState({
			value: e.target.value,
		});
	};

	render() {
		const { comments, value } = this.state;
		const { userInfo, setArticleCommentLoading, props } = this.props;
		return (
			<div className="comment-box">
				{
					userInfo ?
						<Comment
							avatar={
								<Avatar
									src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png?imageslim"
									alt="user"
								/>
							}
							content={
								<Editor
									onChange={this.handleChange}
									onSubmit={this.handleSubmit}
									submitting={setArticleCommentLoading}
									value={value}
								/>
							}
						/>
						:
						<div className="login-tips-box">
							<Avatar
								src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png?imageslim"
								alt="user"
							/>
							<div className="login-tips">秀儿，请登录后再发炎~</div>
						</div>
				}

				<div className="header-tips">
					{
						<CommentList 
							props={{...props, uid: userInfo ? userInfo.userId : null, submitting: setArticleCommentLoading }}
							comments={comments} 
							qureyComment={this.qureyComment}
						/>
					}
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