/*
 * @Date: 2019-12-29 21:00:49
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-17 14:22:46
 * @FilePath: \ting_ge_blog\pages\_app.js
 */
import App from 'next/app'
import React from 'react'
import 'antd/dist/antd.less'
import '@/public/style/global.less'
import { memorial } from '@/public/utils/utils'
import { Provider } from 'react-redux'
import store from '@/store'
import NProgress from 'nprogress'
import Router from 'next/router'
import 'nprogress/nprogress.css'
import Layout from '@/components/Layout'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import { isLogin } from '@/public/utils/utils'

//声明一个MyApp组件，然后这个组件用Provider进行包裹 react-redux。
export default class MyApp extends App {
	state = {}

    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return { pageProps }
    }

    componentDidMount() {
		// 公祭日置灰
		memorial()
		
        console.log('%c 欢迎来到 TinggeBlog! ', 'background: rgba(18, 141, 244, 0.1); color: #1890ff');
        console.log('%c 如果你能够看到这, 那么你肯定没有女朋友！', 'color: #1890ff');

        // 百度统计
		var _hmt = _hmt || [];
		(function () {
			var hm = document.createElement("script");
			hm.src = "https://hm.baidu.com/hm.js?8012cc8247fdc399904b23b2e8cb2266";
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(hm, s);
		})();

        // 点击 核心价值观
		let index = 0;
		const fnTextPopup = (event) => {
			let arr = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善']
			if (!arr || !arr.length) {
				return;
			}

			let x = event.pageX,
				y = event.pageY;
			let eleText = document.createElement('span');
			eleText.className = 'text-popup';
			document.documentElement.appendChild(eleText);
			if (arr[index]) {
				eleText.innerHTML = arr[index];
			} else {
				index = 0;
				eleText.innerHTML = arr[0];
			}
			// 动画结束后删除自己
			eleText.addEventListener('animationend', function () {
				eleText.parentNode.removeChild(eleText);
			});
			// 位置
			eleText.style.left = (x - eleText.clientWidth / 2) + 'px';
			eleText.style.top = (y - eleText.clientHeight) + 'px';
			// index递增
			index++;
		};

		document.documentElement.addEventListener('click', fnTextPopup, false)


		// 轮询消息 头一次查的比较快，后面为一分钟查询一次
		setTimeout(() => {
			this.getMsg()
		}, 2000);

		setInterval(() => {
			this.getMsg()
		}, 60000);

	}
	
	getMsg = () => {
		if(isLogin()){
			request(serviceApi.getMsg).then(res=>{
				// 存入react-redux
				store.dispatch({
					type: 'changeMsg',
					payload: res && res.data
				})
			})
		}
	}

    componentWillUnmount(){
		// 注销解绑事件
		document.documentElement.removeEventListener('click', fnTextPopup, false)
    }

    render() {
        const { Component, pageProps } = this.props
        return (
            <Provider store={store}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        )
    }
}

Router.events.on('routeChangeStart', (...args) => {
    NProgress.start();

    // 百度统计
    window._hmt.push(['_trackPageview',  location.pathname]);
})

Router.events.on('routeChangeComplete', (...args) => {
    NProgress.done();
})

Router.events.on('routeChangeError', (...args) => {
    NProgress.done();
})
