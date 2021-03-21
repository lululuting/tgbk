/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-02-06 09:47:54
 * @LastEditors: TingGe
 * @Description: 用户展示组件
 * @FilePath: /ting_ge_blog/components/UpInfo/index.js
 */

import React, { useEffect } from 'react'
import { Avatar, Card, Tag, Divider, Popover } from 'antd'
import classnames from 'classnames'
import Link from 'next/link'
import IconFont from '@/components/IconFont'
import {
	QqOutlined,
	WeiboOutlined,
	GithubOutlined,
	WechatOutlined,
	EnvironmentOutlined,
	TagsOutlined,
	ToolOutlined
  } from '@ant-design/icons';
import './style.less'

const UpInfo = ({ data, link, children }) => {

	useEffect(() => {

	}, [])

	const switchType = (type) => {
		switch (type) {
			case 'bilibili':
				return (
					<Avatar size={28} icon={<IconFont type="iconbilibili-line" />} className={classnames("contact-icon bilibili")} />
				)
			case 'weibo':
				return (
					<Avatar size={28} icon={<WeiboOutlined />} className={classnames("contact-icon weibo")} />
				)
			case 'github':
				return (
					<Avatar size={28} icon={<GithubOutlined />} className={classnames("contact-icon github")} />
				)
			case 'qq':
				return (
					<Avatar size={28} icon={<QqOutlined />} className={classnames("contact-icon qq")} />
				)
			case 'wx':
				return (
					<Avatar size={28} icon={<WechatOutlined />} className={classnames("contact-icon wx")} />
				)
		}
	}
                                                           
	return (
		<Card className={classnames('up-info')} bordered={false} bodyStyle={{ padding: 0 }}>
			<Choose>
				<When condition={link}>
					<Link href={{ pathname: '/userCenter', query: { id: data.id } }} >
						<a className="user-avatar-box">
							<Avatar size={100} src={data.avatar + '?imageslim'}></Avatar>
						</a>
					</Link>

					<Link href={{ pathname: '/userCenter', query: { id: data.id } }}>
						<a>
							<p className="up-name">{data.userName}</p>
						</a>
					</Link>
				</When>
				<Otherwise>
					<Avatar size={100} src={data.avatar + '?imageslim'}></Avatar>
					<p className="up-name">{data.userName}</p>
				</Otherwise>
			</Choose>

			<p className="up-autograph">{data.autograph}</p>

			<If condition={data.post}>
				<p className="up-post">
					<ToolOutlined />
					{data.post}
				</p>
			</If>

			<If condition={data.address}>
				<p className="up-address">
					<EnvironmentOutlined />
					{data.address}
				</p>
			</If>

			<If condition={data.tags && data.tags.length > 0}>
				<div className="up-tags">
					<TagsOutlined />
					<div>
						<For each="i" index="k" of={data.tags}>
							<Tag color="blue" key={k}>{i}</Tag>
						</For>
					</div>
				</div>
			</If>

			<If condition={data.contact && data.contact.length}>
				<Divider>联系方式</Divider>
			</If>

			<div style={{ paddingBottom: 20 }}>
				<If condition={data.contact && data.contact.length}>
					<For each="item" index="index" of={data.contact}>
						<a href={item.link && item.link} target="_blank" key={index}>
							{
								item.code ?
									<Popover placement="bottom" content={
										<div className="re-code">
											<div className="re-code"><img src={item.code} alt="" /></div>
										</div>
									}>
										{(switchType(item.type))}
									</Popover>
									: switchType(item.type)
							}
						</a>
					</For>
				</If>
			</div>

			{children}
		</Card>

	)
}

export default UpInfo

