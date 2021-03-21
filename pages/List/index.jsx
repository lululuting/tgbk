/*
 * @Author: TingGe
 * @Date: 2021-01-20 10:03:02
 * @LastEditTime: 2021-03-17 10:06:31
 * @LastEditors: TingGe
 * @Description: 列表页
 * @FilePath: /ting_ge_blog/pages/list/index.jsx
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import { Row, Col, Card, } from 'antd'
import classnames from 'classnames'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import ArticeList from '@/components/ArticeList'
import LazyImg from '@/components/LazyImg'
import {
	ExperimentOutlined,
	CameraOutlined,
	CoffeeOutlined,
	SwapOutlined,
} from '@ant-design/icons'
import './style.less'

const ListPage = (porps) => {

	const [listData, setListData] = useState(porps.listData)
	const [tabKey, setTabKey] = useState(porps.tabIndex)
	const [bannerData, setBannerData] = useState(porps.banner)
	// 广告
	const [advert, setAdvert] = useState(porps.advertList)
	// 页数
	const [page, setPage] = useState(1)
	const [loadMoreLoading, setLoadMoreLoading] = useState(false)
	const [isNoData, setIsNoData] = useState(false)
	const [listSort, setListSort] = useState(true)

	useEffect(() => {
		queryLsit(porps.tabIndex, 1, 5, listSort).then((res) => {
			setListData(res.data)
		})
		setTabKey(porps.tabIndex)
	}, [porps.tabIndex])

	// 切换排序
	const listSortFn = () => {
		queryLsit(tabKey, 1, 5, !listSort).then((res) => {
			setListData(res.data)
			setLoadMoreLoading(false)
		})

		setListSort(!listSort)
		setPage(1)
		setLoadMoreLoading(true)
	}

	/**
	* 查询列表方法
	* @description: 公用查询列表方法
	* @param { type page limit listSort }
	* @return: 文章列表/用户列表
	*/
	const queryLsit = (tabKey, page, limit, listSort) => {
		return new Promise((resolve, reject) => {
			request(serviceApi.getTypeList, {
				method: 'get',
				params: {
					type: tabKey === '0' ? null : tabKey,
					page: page,
					limit: limit,
					sort: listSort ? 0 : 1
				}
			}).then((res) => {
				resolve(res)
			})
		})
	}

	// 加载更多
	const loadMore = () => {
		setPage(page + 1)
		setLoadMoreLoading(true)

		queryLsit(tabKey, page + 1, 5, listSort).then((res) => {
			if (!res.data.length) {
				setLoadMoreLoading(false)
				setIsNoData(true)
				return
			}
			setListData([].concat(listData, res.data))
			setLoadMoreLoading(false)
		})
	}

	// 切换
	const tabKeyChang = (key) => {
		queryLsit(key, 1, 5, listSort).then((res) => {
			setListData(res.data)
			setLoadMoreLoading(false)
		})

		setPage(1)
		setLoadMoreLoading(true)
		setIsNoData(false)
		setTabKey(key)
	}

	const operationTabList = [
		{
			key: '0',
			tab: (
				<span>
					全部
				</span>
			),
		},
		{
			key: '1',
			tab: (
				<span>
					<ExperimentOutlined />
					技术
				</span>
			),
		},
		{
			key: '2',
			tab: (
				<span>
					<CameraOutlined />
					摄影
				</span>
			),
		},
		{
			key: '3',
			tab: (
				<span>
					<CoffeeOutlined />
					生活
				</span>
			),
		},
	];

	return (
		<>
			<Head>
				<title>挺哥博客-文章列表</title>
			</Head>

			<>
				<div className="banner">
					<LazyImg background={true} params="?imageslim" src={bannerData && bannerData.url && bannerData.url} />
				</div>
				<Row>
					{/* 列表 */}
					<Col id='left-box' xs={24} sm={24} md={24} lg={18} xl={18} >
						<div className={classnames('list-nav')}>
							<Card
								bordered={false}
								tabList={operationTabList}
								activeTabKey={tabKey}
								onTabChange={tabKeyChang}
								tabBarExtraContent={
									<span onClick={listSortFn} className="switch-btn">
										<SwapOutlined style={{ color: '#1890ff', marginRight: 10 }} />
										切换为
										{
											listSort ? '热门排序' : '时间排序'
										}
									</span>
								}
							>
								<ArticeList
									loadMore={loadMore}
									isNoData={isNoData}
									loading={loadMoreLoading}
									data={listData}
								/>
							</Card>
						</div>
					</Col>

					<Col xs={0} sm={0} md={0} lg={6} xl={6} style={{ paddingLeft: 24 }}>

						{/* 广告位 */}
						<div className="advert-list">

							<For each="item" of={advert}>
								<Card
									style={{ marginBottom: 20 }}
									bordered={false}
									key={item.id}
								>
									<p style={{ fontWeight: 'bold' }}>广告</p>
									<a href={item.link}>
										<img style={{ width: '100%' }} src={item.url} params="?imageslim" alt={item.title} />
									</a>
								</Card>
							</For>
						</div>
					</Col>
				</Row>
			</>
		</>
	)
}

export async function getServerSideProps(context) {

	// 广告
	const promise1 = new Promise((resolve) => {
		request(serviceApi.getAdvertList, {
			method: 'get',
		}).then((res) => {
			resolve(res.data)
		})
	})

	// topbanner
	const promise2 = new Promise((resolve) => {
		request(serviceApi.getListBanner).then((res) => {
			resolve(res.data[0])
		})
	})

	// list
	const promise3 = new Promise((resolve) => {
		request(serviceApi.getTypeList, {
			method: 'get',
			params: {
				type: context.query.type === '0' ? null : context.query.type,
				page: 1,
				limit: 5,
				sort: 0
			}
		}).then((res) => {
			resolve(res.data)
		})
	})

	let advertList = await promise1
	let banner = await promise2
	let listData = await promise3
	let tabIndex = context.query.type

	return { props: { tabIndex, advertList, banner, listData } }
}

export default ListPage