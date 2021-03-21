/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-03-01 22:36:33
 * @LastEditors: TingGe
 * @Description: layout 公共布局
 * @FilePath: /ting_ge_blog/components/Layout/index.jsx
 */

import React from 'react'
import Head from 'next/head'
import Header from '../Header'
import Footer from '../Footer'
import Sider from '../Side'
import dynamic from 'next/dynamic'
import { connect } from 'react-redux'
const Aplayer = dynamic(import('../Aplayer'), { ssr: false })
import './style.less'

const Layout = (props) => {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
			</Head>

			<div id="box">
				<Header />
				<div id="content" className="wrap">
					{props.children}
					<Sider />
					<Aplayer id={props.userInfo && props.userInfo.songsId ? props.userInfo.songsId : 705619441} />
				</div>
				<Footer />
			</div>
		</>
	)
}


export default connect(({ userInfo }) => ({
	userInfo,
}))(Layout);