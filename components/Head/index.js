/* 公共head
 * @Date: 2020-04-16 21:40:23
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-04-16 21:43:07
 * @FilePath: \ting_ge_blog\components\Head\index.js
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