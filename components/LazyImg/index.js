/*
 * @Date: 2020-02-08 16:33:40
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-20 00:02:51
 * @FilePath: \ting_ge_blog\components\LazyImg\index.js
 */
/* 
* props.src 		src
* props.style 		样式
* props.param 		连接后参数
* props.alt 		alt
*/

import React, { useState, useEffect } from 'react'
import './style.less'

const LazyImg = (props) => {
	const [done, setDone] = useState(false)
	useEffect(() => {
		const img = new Image();
		// 发出请求，请求图片
		img.src = props.src;
		// 当图片加载完毕
		img.onload = () => {
			setDone(true)
		}
	}, [])

	return (
		<>
			{
				done
					?
					(
						props.background ?
							<div style={props.style && props.style, { backgroundImage: `url(${props.src + (props.params ? props.params : '')})` }} className="item-background">
								{props.children ? props.children : null}
							</div>
							:
							<img style={props.style && props.style} src={props.src + (props.params ? props.params : '')} alt={props.alt} className="item-img" />

					)
					:
					<div className="loader">
						<span className="txt">
							<span>挺</span>
							<span>哥</span>
							<span>博</span>
							<span>客</span>
						</span>
					</div>
			}
		</>
	)
}

export default LazyImg