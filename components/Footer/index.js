
import React from 'react'
import './style.less'
import classnames from 'classnames'
import { Row, Col, Icon } from 'antd'
import Link from 'next/link'

const Footer = () => (
	<footer className={classnames('footer')}>
		<Row className={classnames('wrap footer-box')} type="flex" align="middle" justify="space-between">
			<Col className="left-logo" xs={0} sm={0} md={2} lg={2} xl={2}>
				<Link href="./index">
					<a>
						<img className="logo" src="/static/logo.png"></img>
					</a>
				</Link>
			</Col>
			<Col className="right-memu" xs={0} sm={0} md={22} lg={22} xl={22}>
				<p style={{marginTop: 15}}>© 2020 <span style={{color: '#007bff'}}>Ting ge</span> 

				<a className="beian-a" target="_blank" href="http://www.beian.miit.gov.cn">
					粤ICP备20008654号-1
				</a>

				</p>
				<p>挺哥博客, 挺哥网上冲浪的记录站 <Icon type="heart" theme="filled" /></p>
			</Col>
		</Row>

	</footer>
)
export default Footer