/*
 * @Date: 2020-04-09 23:43:42
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-20 21:42:46
 * @FilePath: \ting_ge_blog\public\utils\request.js
 */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {
  extend
} from 'umi-request';
import {
  notification,
  message
} from 'antd';

import store from '@/store'

const codeMessage = {
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序 网络层
 * process.browser 区分环境，服务端渲染的接口不捕抓。
 */

const errorHandler = error => {
  const {
    response
  } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {
      status,
      url
    } = response;

    if (process.browser) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }

  } else if (!response) {
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
  credentials: 'omit', // 'omit/include', 带上cookie七牛会跨域
  // mode: 'no cors' 
});

/**
 * 配合redux 处理loading
 */
const setLoading = (url, status) => {


  // 特殊处理第三方七牛云上传的的接口
  if(url === "http://upload-z2.qiniup.com" || url === "http://upload-z2.qiniup.com/"){
    store.dispatch({
      type: 'changeLoading',
      payload: {
        api: 'uploadQiniuLoading',
        status
      }
    })
    return
  }


  // 默认是以default开头的才算api请求
  if (url.indexOf("default") != -1) {
    let api = url.substring(url.lastIndexOf("\/") + 1, url.length)

    if(api.indexOf("?") > 0){
      api = api.substring(0, api.indexOf("?")) + "Loading";
    }else{
      api = api + "Loading";
    }
    
  
    store.dispatch({
      type: 'changeLoading',
      payload: {
        api,
        status
      }
    })
  }
}

if (process.browser) {
  // request拦截器, 改变url 或 options.
  request.interceptors.request.use(async (url, options) => {

    let token = null;
    if (JSON.parse(localStorage.getItem('userInfo'))) {
      // egg-jwt 切记 token 不要直接发送，要在前面加上 Bearer 字符串和一个空格 解密不能用直接verify要变结合设置的'Bearer ', 我他妈找了好久，才解决这个坑！ authorization.split(' ')[1]！！！！
      token = 'Bearer '+JSON.parse(localStorage.getItem('userInfo')).token
    }

    let headers = {};
 
    // 这个接口不允许带头
    if(url !== 'http://api.youngam.cn/api/one.php'){
       headers = {
        'Authorization': token
      };
    }

    setLoading(url, true)

    return ({
      url: url,
      options: {
        ...options,
        headers
      },
    });

  })

  // response拦截器, 处理response
  request.interceptors.response.use(async (response) => {
    const data = await response.clone().json();

    try {
      if (data && data.code && data.code !== 200) {
        notification.error({
          description: data.msg,
          message: '请求失败',
        });
      }

      if (data && data.code && data.code == 401) {
        localStorage.setItem('userInfo',null);
        store.dispatch({
          type: 'changeUserInfo',
          payload: null
        })
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(response.url, false)
    return response;
  })

}

export default request;