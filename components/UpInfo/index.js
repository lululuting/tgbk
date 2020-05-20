import React, { useEffect } from 'react'
import { Icon, Avatar, Card, Tag, Divider, Popover } from 'antd'
import classnames from 'classnames'
import Link from 'next/link'
import IconFont from '@/components/IconFont'
import './style.less'

const UpInfo = ({ data, link, children }) => {

	useEffect(() => {

	}, [])

	const switchType = (type) => {
		switch (type) {
			case 'bilibili':
				return (
					<Avatar size={28} className={classnames("contact-icon bilibili")}>
						<IconFont type="iconbilibili-line" />
					</Avatar>
				)
			case 'weibo':
				return (
					<Avatar size={28} icon="weibo-circle" className={classnames("contact-icon weibo")} />
				)
			case 'github':
				return (
					<Avatar size={28} icon="github" className={classnames("contact-icon github")} />
				)
			case 'qq':
				return (
					<Avatar size={28} icon="qq" className={classnames("contact-icon qq")} />
				)
			case 'wx':
				return (
					<Avatar size={28} icon="wechat" className={classnames("contact-icon wx")} />
				)
		}
	}

	return (

		<Card className={classnames('up-info')} bordered={false} bodyStyle={{ padding: 0 }}>
			{
				link ?
					<Link href={{ pathname: '/userCenter', query: { id: data.id } }}>
						<a>
							<Avatar size={100} src={data.avatar + '?imageslim'}></Avatar>
						</a>
					</Link>
					:
					<Avatar size={100} src={data.avatar + '?imageslim'}></Avatar>
			}

			{
				link ?
					<Link href={{ pathname: '/userCenter', query: { id: data.id } }}>
						<a>
							<p className="up-name">{data.userName}</p>
						</a>
					</Link>
					:
					<p className="up-name">{data.userName}</p>
			}

			<p className="up-autograph">{data.autograph}</p>

			{
				data.post ?
					<p className="up-post">
						<Icon type="tool" />
						{data.post}
					</p>
					: null
			}


			{
				data.address ?
					<p className="up-address">
						<Icon type="environment" />
						{data.address}
					</p> : null
			}

			{
				data.tags && data.tags.length > 0 ?
					<div className="up-tags">
						<Icon type="tags" />

						<div>
							{
								data.tags.map((i, k) => (
									<Tag color="blue" key={k}>{i}</Tag>
								))
							}
						</div>
					</div> : null
			}

			{
				data.contact && data.contact.length ?
					<Divider>联系方式</Divider>
					: null
			}

			<div style={{ paddingBottom: 20 }}>
				{
					data.contact && data.contact.length ? data.contact.map((item, index) => (
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
					))
						: null
				}
			</div>
		
			{children}
		</Card>

	)
}

export default UpInfo

