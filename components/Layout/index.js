/*
 * @Date: 2020-01-01 14:31:22
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-17 14:29:10
 * @FilePath: \ting_ge_blog\components\Layout\index.js
 */
import React, { useEffect } from 'react'
import Head from 'next/head'
import Header from '../Header'
import Footer from '../Footer'
import Sider from '../Side'
import dynamic from 'next/dynamic'
const Aplayer = dynamic(import('../Aplayer'), { ssr: false })
import './style.less'

const Layout = (props) => {

	useEffect(() => {
	}, [])
	
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=device-dpi" />
			</Head>
			
			<div id="box">
				<Header />
				<div id="content" className="wrap">
					{props.children}
					<Sider />
					<Aplayer id="705619441" />
				</div>
				<Footer />
			</div>
		</>
	)
}
export default Layout