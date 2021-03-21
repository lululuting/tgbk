/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-02-06 10:16:55
 * @LastEditors: TingGe
 * @Description: 通用尾部
 * @FilePath: /ting_ge_blog/components/Footer/index.js
 */

import React from 'react'
import classnames from 'classnames'
import { Row, Col } from 'antd'
import Link from 'next/link'
import {
	HeartFilled
} from '@ant-design/icons';
import './style.less'

const Footer = () => (
	<footer className={classnames('footer')}>
		<Row className={classnames('wrap footer-box')} type="flex" align="middle" justify="space-between">
			<Col className="left-logo" xs={0} sm={0} md={2} lg={2} xl={2}>
				<Link href="/">
					<a>
						<img className="logo" src="/static/logo.png"></img>
					</a>
				</Link>
			</Col>
			<Col className="right-memu" xs={0} sm={0} md={22} lg={22} xl={22}>
				<p style={{ marginTop: 15 }}>© 2020
				<Link href="/about">
						<a style={{ color: '#007bff' }}> TinggeBlog</a>
					</Link>
					<a className="beian-a" target="_blank" href="http://www.beian.miit.gov.cn">
						粤ICP备20008654号-1
				</a>
				</p>
				<p>挺哥博客, 挺哥和他的小伙伴们网上冲浪的记录站 <HeartFilled /></p>
			</Col>
		</Row>

	</footer>
)
export default Footer