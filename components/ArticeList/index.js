import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.less'
import classnames from 'classnames'
import { List, Icon, Button, Divider } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import LazyImg from '../LazyImg'

import moment from 'moment'


moment.locale('zh-cn');

const IconText = ({ type, text }) => (
	<span>
		<Icon type={type} style={{ marginRight: 8 }} />
		{text}
	</span>
);


// 截取描述 100 字，加省略号
const substrtext = (text, length) => {
	if (text.length > length)
		return text.substring(0, length) + '...';
	return text;
}

// 搜索高亮
const searchHighlight = (title, searchValue) => {
	return 	(
		<a dangerouslySetInnerHTML={{__html:   title.replace(new RegExp(searchValue,"g"),`<i class='hot-str'>${searchValue}</i>`)}} />
	)
}


// 前往用户中心
const linkUserCenter = (e, id) => {
	e.stopPropagation();

	Router.push({
		pathname: '/userCenter',
		query:{
			id
		}
	})
}


const ArticeList = (props) => {
	return (
		<div className="artice-list">
			<List
				itemLayout="horizontal"
				dataSource={props.data}
				split={false}
				locale={
					{ emptyText: 'ㄟ( ▔, ▔ )ㄏ 暂无数据' }
				}
				itemLayout="vertical"
				loading={props.loading}
				loadMore={
					props.data && props.data.length >= 5 ?
						(props.loadMore && !props.isNoData ?
						<div style={{textAlign: 'center', marginBottom: 24}}>
							<Button loading={props.loading} onClick={()=>props.loadMore()}>加载更多</Button>
						</div>
						:
						<div className={classnames('bottom-tips')}>
							<Divider>暂时只有这么多了</Divider>
						</div>)
					: null
				}
				renderItem={item => (
					<List.Item
						key={item.id}
						actions={[
							<IconText key="view" type="fire" text={item.viewCount} />,
							<IconText key="like" type="like" text={item.likeCount} />,
							<span onClick={(e)=>linkUserCenter(e, item.userId)}>{item.userName}</span>,
							<span>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</span>,
						]}

						extra={
							<Link href={{ pathname: '/detail', query: { id: item.id } }}>
								<a className={classnames('item-img')}>
									<LazyImg src={item.cover} alt={item.title} params="?imageView2/1/w/260/h/165"/>
								</a>
							</Link>
						}
					>
						<List.Item.Meta
							title={
								<>
									{
										props.typeTag && <span className="item-type">{item.typeName}</span>
									}
									<Link href={{ pathname: '/detail', query: { id: item.id } }}>
										{
											props.search ? 
											searchHighlight(item.title, props.search)
											:
											<a>{item.title}</a>
										}
									</Link>
								</>
							}
							description={
								<ul className="item-tag-list">
									{
										item.tags && item.tags.split(',').map((tag, index) => (
											<li className="item-tag" key={index}>
												<span># </span>
												{tag}
											</li>
										))
									}
								</ul>
							}
						/>
						<div className={styles.listContent}>
							<Link href={{ pathname: '/detail', query: { id: item.id } }}>
								<a className="description">{substrtext(item.introduce, 60)}</a>
							</Link>
						</div>
					</List.Item>
				)}
			/>

		</div>
		
	)
}


ArticeList.propTypes = {
	data: PropTypes.array,
	typeTag: PropTypes.bool,
	loading: PropTypes.bool,
	isNoData: PropTypes.bool,
	search: PropTypes.string,

}

export default ArticeList