/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2022-02-10 10:48:06
 * @LastEditors: TingGe
 * @Description: 公用head
 * @FilePath: /ting_ge_blog/components/Head/index.jsx
 */

import Head from 'next/head';
const Header = (props) => {
  return <Head>{props.children}</Head>;
};
export default Header;
