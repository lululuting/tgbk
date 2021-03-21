/*
 * @Author: TingGe
 * @Date: 2021-01-25 15:27:53
 * @LastEditTime: 2021-01-31 14:50:31
 * @LastEditors: TingGe
 * @Description: 消息中心
 * @FilePath: /tg-blog/pages/msgCenter/index.jsx
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import { Row, Col, Card, Affix, Spin, Button, Divider } from 'antd'
import classnames from 'classnames'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import LazyImg from '@/components/LazyImg'
import MsgList from '@/components/MsgList'
import { connect } from 'react-redux'
import IconFont from '@/components/IconFont'
import './style.less'

const MsgPage = (props) => {

	const [tabKey, setTabKey] = useState(0)
	const [bannerData, setBannerData] = useState(props.banner)
	const [dataList, setDataList] = useState([])
	// 页数
	const [page, setPage] = useState(1)
	const [isNoData, setIsNoData] = useState(false)

	useEffect(() => {
		// 消息列表就不做ssr啦
		getMsgList(tabKey, page, 10)
	}, [])

	const navData = [
		{
			icon: 'iconbell',
			key: 0,
			text: '全部消息'
		},
		{
			icon: 'iconmail',
			key: 12,
			text: '回复我的'
		},
		{
			icon: 'iconlike',
			key: 34,
			text: '收到的赞'
		},
		{
			icon: 'iconheart',
			key: 5,
			text: '粉丝关注'
		},
		{
			icon: 'iconsound',
			key: 6,
			text: '系统通知'
		}
	]

	// 加载更多
	const loadMore = (limit) => {
		setPage(page + 1)
		request(serviceApi.getMsgList, {
			method: 'get',
			params: {
				type: tabKey == 0 ? null : tabKey,
				page: page + 1,
				limit
			}
		}).then((res) => {
			if (res.data.length !== limit) {
				setIsNoData(true)
			}
			setDataList([].concat(dataList, res.data))
		})
	}

	const getMsgList = (type, page, limit) => {
		request(serviceApi.getMsgList, {
			method: 'get',
			params: {
				type: type == 0 ? null : type,
				page,
				limit,
			}
		}).then(res => {
			setDataList(res.data)

			// 不满就是没有更多了
			if (res.data.length !== limit) {
				setIsNoData(true)
			}

			// 消点
			request(serviceApi.getMsg).then(ress => {
				props.changeMsg(ress.data)
			})
		})
	}

	// 切换消息类型
	const tabKeyChang = (key) => {
		setPage(1)
		setIsNoData(false)
		setTabKey(key)
		getMsgList(key, 1, 10)
	}

	// 格式化标题
	const formatTitle = (key) => {
		return navData.filter(item => {
			return item.key == key
		})[0]
	}

	return (
		<>
			<Head>
				<title>挺哥博客-消息中心</title>
			</Head>

			<>
				<div className="banner">
					<LazyImg background={true} params="?imageslim" src={bannerData && bannerData.url && bannerData.url} />
				</div>

				<Row className="msg-page">

					{/* 这里分两份代码 pc 和移动 这样子最省事 */}
					<Col xs={0} sm={0} md={0} lg={5} xl={5} className="left-nav-box" style={{ paddingRight: 24 }}>
						<Affix offsetTop={68}>
							<Card bordered={false}>
								<ul className="left-nav-list">
									<For each="item" of={navData}>
										<li key={item.key} className={tabKey == item.key ? 'active' : ''} onClick={() => tabKeyChang(item.key)}>
											<IconFont type={item.icon} style={{ fontSize: 16 }} /> {item.text}
										</li>
									</For>
								</ul>
							</Card>
						</Affix>
					</Col>

					{/* 移动端不用固定 */}
					<Col xs={24} sm={24} md={0} lg={0} xl={0} className="left-nav-box" >
						<Card
							style={{ marginBottom: 20 }}
							bordered={false}
						>
							<ul className="left-nav-list">
								<For each="item" of={navData}>
									<li key={item.key} className={tabKey == item.key ? 'active' : ''} onClick={() => tabKeyChang(item.key)}>
										<IconFont type={item.icon} style={{ fontSize: 18 }} /> {item.text}
									</li>
								</For>
							</ul>
						</Card>
					</Col>

					{/* 列表 */}
					<Col id='left-box' xs={24} sm={24} md={24} lg={19} xl={19} >
						<div className={classnames('data-list')}>
							<Card
								bordered={false}
								title={
									<>
										<IconFont type={formatTitle(tabKey).icon} className="search-result-icon" style={{ color: '#1890ff', marginRight: 10, fontSize: 18 }} />
										{formatTitle(tabKey).text}
									</>
								}
							>
								<Spin spinning={props.getMsgListLoading}>
									<MsgList data={dataList} />

									<If condition={dataList.length}>
										<div>
											{
												!isNoData ?
													<div style={{ textAlign: 'center', marginBottom: 24, marginTop: 24 }}>
														<Button loading={props.getMsgListLoading} onClick={() => loadMore(10)}>加载更多</Button>
													</div>
													:
													<div className={classnames('bottom-tips')}>
														<Divider>暂时只有这么多了</Divider>
													</div>
											}
										</div>

									</If>
								</Spin>
							</Card>
						</div>
					</Col>

				</Row>
			</>
		</>
	)
}

export async function getServerSideProps(context) {

	const promise = new Promise((resolve) => {
		request(serviceApi.getListBanner).then((res) => {
			resolve(res.data[0])
		})
	})

	let banner = await promise

	return { props: { banner } }
}

const stateToProps = (state) => {
	return {
		msgData: state.msgData,
		getMsgListLoading: state.getMsgListLoading
	}
}

const dispatchToProps = (dispatch) => {
	return {
		changeMsg(obj) {
			dispatch({
				type: 'changeMsg',
				payload: obj
			})
		}
	}
}

export default connect(stateToProps, dispatchToProps)(MsgPage)

