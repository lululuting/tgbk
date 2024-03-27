/*
 * @Date: 2020-04-09 23:43:42
 * @LastEditors: TingGe
 * @LastEditTime: 2024-03-14 14:37:20
 * @FilePath: /ting_ge_blog/public/utils/request.js
 *
 * umi-request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import { extend } from 'umi-request';
import { notification, message } from 'antd';
import store from '@/store';
// import serviceApi from '../../config/service';
import Cookies from 'js-cookie';

// const codeMessage = {
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

/**
 * 异常处理程序 网络层
 * process.browser 区分环境，服务端渲染的接口不捕抓。
 */

const errorHandler = (error) => {
  const { response } = error;
  if (!response) {
    if (process.browser) {
      message.error('发生异常，有个接口无法连接服务器');
    }
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  // 常用的JWT模式，对于token的保存，一般都是保存在localStorage中，而在服务端渲染中，是没有localStorage的定义的，无法从localStorage中获取数据，只能从Cookie中获取，故token存cookie 不放请求头
  credentials: 'include' // 'omit/same-origin/include' 带cookies
});

/**
 * 配合redux 处理loading
 */
const setLoading = (url, status) => {
  // 特殊处理第三方七牛云上传的的接口
  if (
    url === 'http://upload-z2.qiniup.com' ||
    url === 'http://upload-z2.qiniup.com/'
  ) {
    store.dispatch({
      type: 'changeLoading',
      payload: {
        api: 'uploadQiniuLoading',
        status
      }
    });
    return;
  }

  // 默认是以default开头的才算api请求
  if (url.indexOf('default') != -1) {
    let api = url.substring(url.lastIndexOf('/') + 1, url.length);

    if (api.indexOf('?') > 0) {
      api = api.substring(0, api.indexOf('?')) + 'Loading';
    } else {
      api = api + 'Loading';
    }

    store.dispatch({
      type: 'changeLoading',
      payload: {
        api,
        status
      }
    });
  }
};


if (process.browser) {
  // request拦截器, 改变url 或 options.
  request.interceptors.request.use(async (url, options) => {
    setLoading(url, true);
    return {
      url: url,
      options: {
        ...options
      }
    };
  });

  // response拦截器, 处理response
  request.interceptors.response.use(async (response) => {
    const data = await response.clone().json();
    setLoading(response.url, false);

    if (data?.code === 500) {
      notification.error({
        description: data.msg,
        message: '请求错误'
      });
    }

    if (data?.code === 401) {
      Cookies.remove('userInfo');
      store.dispatch({
        type: 'changeUserInfo',
        payload: null
      });
      notification.info({
        description: data.msg,
        message: '登陆失效'
      });
    }

    return response;
  });
}

export default request;
