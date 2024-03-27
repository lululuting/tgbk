/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-05-04 18:10:40
 * @FilePath: /ting_ge_blog/pages/admin/index.jsx
 *
 *  没什么用的页面，写这个页面纯粹是为了路由好看一点
 */
const Admin = () => {
  return <>Admin</>;
};

// 访问 /admin 给我重定向到 /admin/banner 去。
export async function getServerSideProps () {
  return {
    redirect: {
      destination: '/admin/banner',
      permanent: false
    }
  };
}
export default Admin;
