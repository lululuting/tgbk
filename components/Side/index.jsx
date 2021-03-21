/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-03-17 10:50:12
 * @LastEditors: TingGe
 * @Description: 侧边栏
 * @FilePath: /ting_ge_blog/components/Side/index.jsx
 */

import React from 'react'
import { BackTop } from 'antd'
import {
	BugOutlined,
	ArrowUpOutlined,
} from '@ant-design/icons';
import './style.less'

const Side = (props) => {
	return (
		<div id="side">
			<BackTop>
				<div className="action-btn">
					<ArrowUpOutlined style={{fontSize: 18}}/>
				</div>
			</BackTop>
			<div className="action-btn" style={{ cursor: 'pointer' }} onClick={() => window.open('https://support.qq.com/product/287609')}>
				<BugOutlined style={{fontSize: 18}}/>
			</div>
		</div>
	)
}

const SideForm = Side
export default SideForm