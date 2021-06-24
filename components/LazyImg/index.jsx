/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-06-05 14:54:17
 * @LastEditors: TingGe
 * @Description: 
 * 	props.src 			src
 * 	props.className 	className
 * 	props.style 		样式
 * 	props.param 		连接后参数
 * 	props.alt 			alt
 *  props.onClcik		funtion
 * @FilePath: /ting_ge_blog/components/LazyImg/index.jsx
 */

import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
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
			<Choose>
				<When condition={done}>
					<Choose>
						<When condition={props.background}>
							<div
								style={props.style && props.style, { backgroundImage: `url(${props.src + (props.params ? props.params : '')})` }}
								className={classnames(`item-background ${props.className ? props.className : ''}`)}
								onClick={props.onClick ? props.onClick() : null}
							>
								{props.children ? props.children : null}
							</div>
						</When>
						<Otherwise>
							<img
								style={props.style && props.style} src={props.src + (props.params ? props.params : '')}
								alt={props.alt}
								className={classnames(`item-img ${props.className ? props.className : ''}`)}
								onClick={props.onClick ? props.onClick : null}
							/>
						</Otherwise>
					</Choose>
				</When>

				<Otherwise>
					<div className="cp-preloader cp-preloader_type1">
						<span className="cp-preloader__letter" data-preloader="挺">挺</span>
						<span className="cp-preloader__letter" data-preloader="哥">哥</span>
						<span className="cp-preloader__letter" data-preloader="博">博</span>
						<span className="cp-preloader__letter" data-preloader="客">客</span>
					</div>
				</Otherwise>
			</Choose>
		</>
	)
}

export default LazyImg