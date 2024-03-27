/* 编辑文章，逻辑继承add
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2022-02-13 17:41:03
 * @FilePath: /ting_ge_blog/pages/articleEdit/[id].jsx
 */
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import Layout from '@/components/Layout';
import { getIsLogin } from '@/public/utils/utils';
import articleAdd from '../articleAdd';
import _ from 'lodash';


class ArticleEdit extends articleAdd {
  constructor (props) {
    super(props);
    _.assign((this.state = {
      initFormValues: _.get(this.props, 'articleDateil')
    }));
  }

  componentDidMount () {
    this.init(_.get(this.props, 'articleDateil.content'));
  }
}
export async function getServerSideProps (context) {
  const isLogin = await getIsLogin(context.req);
  if (!isLogin) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  const getBanner = new Promise((resolve) => {
    request(serviceApi.getListBanner).then((res) => {
      resolve(res.data);
    });
  });

  const getArticleDateil = new Promise((resolve) => {
    request(serviceApi.getArticleDetail, {
      method: 'get',
      params: { id: context.query.id }
    }).then((res) => {
      resolve(res.data);
    });
  });

  let banner = await getBanner;
  let articleDateil = await getArticleDateil;

  return { props: { banner, articleDateil } };
}
ArticleEdit.Layout = Layout;
export default ArticleEdit;
