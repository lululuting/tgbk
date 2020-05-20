/*
 * @Date: 2020-05-10 06:25:44
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-10 18:11:39
 * @FilePath: \ting_ge_blog\components\MsgList\index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { Icon, Avatar, message } from 'antd'
import LazyImg from '@/components/LazyImg'
import moment from 'moment'
import './style.less'

moment.locale('zh-cn');

const MsgList = ({ data }) => {

	const filterType = (key) => {
		switch (key) {
			case '1':
				return '评论了你的文章'
				break;
			case '2':
				return '回复了你的评论'
				break;
			case '3':
				return '点赞了你的文章'
				break;
			case '4':
				return '点赞了你的评论'
				break;
			case '5':
				return '关注了你'
				break;
			default:
				return '系统通知'
				break;
		}


	}

	// 删除通知
	const delMsg = (e, id) => {
		e.stopPropagation()
		message.warning('删除通知，后续再做！')
	}

	// 跳转
	const detailLink = (e,props) => {
		e.stopPropagation()
		if(~~props.type == 5){
			Router.push({
				pathname: '/userCenter',
				query: {
					id: props.sourceId
				}
			})
		}else{
			Router.push({
				pathname: '/detail',
				query: {
					id: props.sourceId
				}
			})
		}
	}

	// 用户跳转
	const linkUser = (e, props) => {
		e.stopPropagation()
		Router.push({
			pathname: '/userCenter',
			query: {
				id: props.userId
			}
		})
	}

	const msgItem = (props) => {
		return (
			<div key={props.id} className="msg-item" onClick={(e)=>detailLink(e, props)}>
				<div className="left-box" onClick={(e)=>linkUser(e,props)}>
					<Avatar style={{ marginRight: 20 }} size={46} src={props.avatar} />
				</div>

				<div className="right-box">
					<div className="text-box">
						<div className="msg-content">
							<div className="title"> <a  onClick={(e)=>linkUser(e,props)} className="user-name">{props.userName} </a>{filterType(props.type)}</div>
							<div className="content">{props.content}</div>
						</div>

						<div className="action-box">
							<span className="time">{moment(props.createTime).format('YYYY-MM-DD HH:mm')}</span>
							<span onClick={(e)=>delMsg(e, props.id)} className="action"><Icon type="delete" /> 删除该通知</span>
						</div>
					</div>

					<div className="source">
						{
							props.type === '1' || props.type === '3' ?
								<LazyImg params="?imageslim" src={props.source} />
								:
								props.source
						}
					</div>

				</div>
			</div>
		)
	}

	return (
		<div className="msg-list">
			{
				data && data.length ? data.map(item => (
					msgItem(item)
				))
				: 
				<div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 暂无数据</div>
			}
		</div>
	)
}

MsgList.propTypes = {
	data: PropTypes.array,
}

export default MsgList