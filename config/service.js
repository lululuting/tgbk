/*
 * @Author: TingGe
 * @Date: 2021-01-31 15:56:07
 * @LastEditTime: 2022-05-04 18:04:45
 * @LastEditors: TingGe
 * @Description: 接口配置
 * @FilePath: /ting_ge_blog/config/service.js
 */

// 区分环境
const isProd =  process.env.NODE_ENV === 'production';
const ipUrl =  isProd ? 'https://lululuting.com/default/' : 'http://dev.lululuting.com/default/';

export default {
  getArticleList: ipUrl + 'getArticleList',             // 文章列表
  getHomeBannerList: ipUrl + 'getHomeBannerList',       // 首页轮播图列表
  getArticleInfo: ipUrl + 'getArticleInfo',             // 文章详细页内容
  getArticleDetail: ipUrl + 'getArticleDetail',         // 文章详情（简单信息）
  getTypeList: ipUrl + 'getTypeList',                   // 列表页内容
  getUserList: ipUrl + 'getUserList',                   // 获取用户列表
  getHotUserList: ipUrl + 'getHotUserList',             // 获取热门用户列表
  getUserInfo: ipUrl + 'getUserInfo',                   // 博主自己的信息
  getAdvertList: ipUrl + 'getAdvertList',               // 获取广告列表
  getListBanner: ipUrl + 'getListBanner',               // 列表页banner
  getDetailBanner: ipUrl + 'getDetailBanner',           // 详情页banner
  readingVolume: ipUrl + 'readingVolume',               // 阅读量
  feedback: ipUrl + 'feedback',                         // 反馈
  getRewardCode: ipUrl + 'getRewardCode',               // 获取赞赏码
  getSearchList: ipUrl + 'getSearchList',               // 搜索页banner
  getSearchBanner: ipUrl + 'getSearchBanner',           // 搜索
  getUserArticleList: ipUrl + 'getUserArticleList',     // 用户发表的文章
  getUserArticleTotal: ipUrl + 'getUserArticleTotal',   // 获取自己发的文件数量 统计
  login: ipUrl + 'login',                               // 登录
  logOut: ipUrl + 'logOut',                             // 退出登录
  getWeiboUserInfo: ipUrl + 'getWeiboUserInfo',         // 获取微博登录的信息
  articleClickLike: ipUrl + 'articleClickLike',         // 文章点赞
  getLikeStatus: ipUrl + 'getLikeStatus',               // 查询文章点赞，联表麻烦所以分开查了
  updateUserInfo: ipUrl + 'updateUserInfo',             // 修改用户信息
  updateMobile: ipUrl + 'updateMobile',                 // 修改手机号
  updatePassword: ipUrl + 'updatePassword',             // 修改密码
  updateSongs: ipUrl + 'updateSongs',                   // 修改网易云歌单
  addEditContact: ipUrl + 'addEditContact',             // 新增或编辑联系方式
  delContact: ipUrl + 'delContact',                     // 删除联系方式
  addEditReward: ipUrl + 'addEditReward',               // 新增或编辑赞赏码
  getArticleComment: ipUrl + 'getArticleComment',       // 获取评论
  setArticleComment: ipUrl + 'setArticleComment',       // 发评论
  commentClickLike: ipUrl + 'commentClickLike',         // 点赞评论
  getMsg: ipUrl + 'getMsg',                             // 消息通知 不分类
  getMsgList: ipUrl + 'getMsgList',                     // 消息通知 分类
  setFollow: ipUrl + 'setFollow',                       // 关注/取消关注
  getFollowList: ipUrl + 'getFollowList',               // 获取关注列表
  getFansList: ipUrl + 'getFansList',                   // 获取粉丝列表
  getQiniuToken: ipUrl + 'getQiniuToken',               // 获取七牛签名
  weather: ipUrl + 'getWeather',                        // 获取天气预报
  getMusicList: ipUrl + 'getMusicList',                 // 网易云歌单 (第三方扒的网易云接口经常改规则跨越啥的，干脆放到服务端请求！) 2022.01.19 现在彻底炸了 无了！
  getYitu: ipUrl + 'getYitu',                           // 每日一图一句 (每日一图也是经常炸，也干脆放到服务端来搞！)
  notice: ipUrl + 'notice',                             // 公告
  getIsLogin: ipUrl + 'getIsLogin',                     // 是否登陆
  addEditArticle: ipUrl + 'addEditArticle',             // 新增/编辑文章
  delArticle: ipUrl + 'delArticle',                     // 删除文章
  uploadQiniu: 'https://upload-z2.qiniup.com',          // 上传七牛
  ipWeather: 'https://api.map.baidu.com/location/ip',   // 百度的ip定位+   'https://ip.help.bj.cn/', 帮天气 (不能用了)

  // 后管接口
  getBannerList: ipUrl + 'getBannerList',               // 轮播图列表
  delBanner: ipUrl + 'delBanner',                       // 删除轮播图
  addEditBanner: ipUrl + 'addEditBanner',               // 添加/编辑轮播图
  frozenArticle: ipUrl + 'frozenArticle',               // 冻结文章
  thawArticle: ipUrl + 'thawArticle',                   // 解冻文章
  getNoticeList: ipUrl + 'getNoticeList',               // 添加公告
  delNotice: ipUrl + 'delNotice',                       // 删除公告
  addEditNotice: ipUrl + 'addEditNotice',               // 添加/编辑公告

  addEditUser: ipUrl + 'addEditUser',                   // 新增或编辑用户
  delUser: ipUrl + 'delUser',                           // 删除用户
  frozenUser: ipUrl + 'frozenUser',                     // 冻结用户
  thawUser: ipUrl + 'thawUser',                         // 解冻用户
  resetPassword: ipUrl + 'resetPassword',               // 重置用户密码

  getCommentList: ipUrl + 'getCommentList',             // 删除评论
  delComment: ipUrl + 'delComment',                     // 删除评论
  frozenComment: ipUrl + 'frozenComment',               // 冻结评论
  thawComment: ipUrl + 'thawComment',                   // 解冻评论

  getFunctionList: ipUrl + 'getFunctionList',           // 功能列表
  setFunction: ipUrl + 'setFunction'                    // 设置功能开关
};
