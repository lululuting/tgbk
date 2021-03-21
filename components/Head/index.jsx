/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-01-31 14:33:39
 * @LastEditors: TingGe
 * @Description: 公用head
 * @FilePath: /tg-blog/components/Head/index.js
 */

import Head from 'next/head'
const Header = (props) => {
	return (
        <Head>
            {props.children}
        </Head>
	)
}
export default Header