/*
 * @Author: 挺哥
 * @Date: 2020-02-17 20:30:42
 * @LastEditTime: 2020-04-16 21:50:13
 * @LastEditors: 挺哥
 * @Description: In User Settings Edit
 * @FilePath: \ting_ge_blog\pages\search\index.js
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import Link from 'next/link'
import { Row, Col, Icon, Avatar, Card, Affix } from 'antd'
import classnames from 'classnames'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import './style.less'
import ArticeList from '@/components/ArticeList'
import LazyImg from '@/components/LazyImg'

const { Meta } = Card

const SearchPage = (props) => {

	const [listData, setListData] = useState(props.articleList)
	const [bannerData, setBannerData] = useState(props.banner)

	const [tabKey, setTabKey] = useState(props.searchType)
	const [searchVal, setSearchVal] = useState(props.searchText)

	const [page, setPage] = useState(1)
	const [loadMoreLoading, setLoadMoreLoading] = useState(false)
	const [isNoData, setIsNoData] = useState(false)
	const [listSort, setListSort] = useState(true)


	useEffect(() => {

	}, [])


	/**
	* 搜索列表方法
	* @description: 公用搜索列表
	* @param { type searchVal page limit listSort }
	* @return: 文章列表/用户列表
	*/
	const searchLsit = (type, searchVal, page, limit, listSort) => {
		return new Promise((resolve, reject) => {
			request(serviceApi.getSearchList, {
				method: 'get',
				params: {
					type,
					searchVal,
					page,
					limit,
					sort: listSort ? 0 : 1
				}
			}).then((res) => {
				resolve(res)
			})
		})
	}


	// 切换排序
	const listSortFn = () => {
		setListSort(!listSort)
		setPage(1)
		setLoadMoreLoading(true)

		searchLsit(tabKey, searchVal, 1, 5, !listSort).then((res) => {
			setListData(res.data)
			setLoadMoreLoading(false)
		})
	}

	// 加载更多
	const loadMore = () => {
		setPage(page + 1)
		setLoadMoreLoading(true)

		searchLsit(tabKey, searchVal, page + 1, 5, listSort).then((res) => {
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
		setListData([])
		setLoadMoreLoading(true)
		setIsNoData(false)
		setTabKey(key)
		setPage(1)

		searchLsit(key, searchVal, 1, 5, listSort).then((res) => {
			if (!res.data.length) {
				setLoadMoreLoading(false)
				setIsNoData(true)
				return
			}
			setListData(res.data)
			setLoadMoreLoading(false)
		})
	}


	return (
		<>
			<Head>
				<title>挺哥博客-搜索列表</title>
			</Head>

			<>
				<div className="banner">
					<LazyImg background={true} params="?imageslim" src={bannerData && bannerData.url && bannerData.url} />
				</div>

				<Row className="search-page">

					{/* 这里分两份代码 pc 和移动 这样子最省事 */}
					<Col xs={0} sm={0} md={6} lg={6} xl={6} className="left-nav-box" style={{ paddingRight: 24 }}>
						<Affix offsetTop={68}>
							<Card
								bordered={false}
							>
								<ul className="left-nav-list">
									<li className={tabKey == 0 ? 'active' : ''} onClick={() => tabKeyChang(0)}>
										<Icon type="read" /> 文章
									</li>

									<li className={tabKey == 1 ? 'active' : ''} onClick={() => tabKeyChang(1)}>
										<Icon type="user" /> 用户
									</li>
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
								<li className={tabKey == 0 ? 'active' : ''} onClick={() => tabKeyChang(0)}>
									<Icon type="read" /> 文章
								</li>

								<li className={tabKey == 1 ? 'active' : ''} onClick={() => tabKeyChang(1)}>
									<Icon type="user" /> 用户
								</li>
							</ul>
						</Card>
					</Col>

					{/* 列表 */}
					<Col xs={24} sm={24} md={18} lg={18} xl={18} >
						<div className={classnames('data-list')}>
							<Card
								bordered={false}
								title={
									<>
										<Icon type="file-search" className="search-result-icon" style={{ color: '#1890ff', marginRight: 10 }} />
										搜索结果
									</>
								}
								extra={
									tabKey == 0 ?
										<span onClick={listSortFn} className="switch-btn" >
											<Icon type="swap" style={{ color: '#1890ff', marginRight: 10 }} />
										切换为
										{
											listSort ? '热门排序' : '时间排序'
										}
										</span>
										: null
								}
							>
								{
									tabKey == 0 ?
										<ArticeList
											loadMore={loadMore}
											isNoData={isNoData}
											loading={loadMoreLoading}
											data={listData}
											search={searchVal}
										/>
										:
										<Row gutter={20}>
											{
												listData.length ? listData.map((item, index) => (
													<Col xs={24} xm={12} lm={12} lg={12} key={index}>
														<Link href={{ pathname: '/userCenter', query: { id: item.id } }}>
															<a>
																<Card bodyStyle={{ padding: 20 }} className="user-list" bordered={false} loading={loadMoreLoading}>
																	<Meta
																		avatar={
																			<Avatar size={60} src={item.avatar} />
																		}
																		title={item.userName}
																		description={item.autograph}
																	/>
																</Card>
															</a>
														</Link>

													</Col>
												))
												:
												<div className="ant-list-empty-text">ㄟ( ▔, ▔ )ㄏ 暂无数据</div>
											}
										</Row>
								}
							</Card>
						</div>
					</Col>
				</Row>
			</>
		</>
	)
}


SearchPage.getInitialProps = async (context) => {
	const promise = new Promise((resolve) => {
		request(serviceApi.getSearchList, {
			method: 'get',
			params: {
				type: context.query.type,
				searchVal: context.query.searchVal,
				page: 1,
				limit: 5,
				sort: 0,
			}
		}).then((res) => {
			resolve(res.data)
		})
	})

	const promise1 = new Promise((resolve) => {
		request(serviceApi.getSearchBanner).then((res) => {
			resolve(res.data[0])
		})
	})


	let articleList = await promise
	let banner = await promise1
	let searchType = context.query.type
	let searchText = context.query.searchVal

	return { articleList, banner, searchType, searchText }
}


export default SearchPage