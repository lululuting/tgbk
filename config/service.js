/*
 * @Date: 2020-01-06 22:57:50
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-20 01:14:09
 * @FilePath: \ting_ge_blog\config\service.js
 */

let ipUrl = 'http://127.0.0.1:7001/default/' // 开发环境使用这个 因为就切换一下很简单，就不搞env环境变量了
// let ipUrl = 'http://xxx.com/default/' // 生成环境用这个 或者试试 我的http://lululuting.com/default/ 

let serviceApi = {
  getBannerList:      ipUrl + 'getBannerList',        // 首页轮播图列表
  getArticleList:     ipUrl + 'getArticleList',       // 首页文章列表
  getArticleInfo:     ipUrl + 'getArticleInfo',       // 文章详细页内容
  getTypeList:        ipUrl + 'getTypeList',          // 列表页内容
  getUserList:        ipUrl + 'getUserList',          // 获取博主列表
  getUserInfo:        ipUrl + 'getUserInfo',          // 博主信息
  getAdvertList:      ipUrl + 'getAdvertList',        // 获取广告列表
  getListBanner:      ipUrl + 'getListBanner',        // 列表页banner
  getDetailBanner:    ipUrl + 'getDetailBanner',      // 详情页banner
  readingVolume:      ipUrl + 'readingVolume',        // 阅读量
  feedback:           ipUrl + 'feedback',             // 反馈
  getRewardCode:      ipUrl + 'getRewardCode',        // 获取赞赏码
  getSearchList:      ipUrl + 'getSearchList',        // 搜索页banner
  getSearchBanner:    ipUrl + 'getSearchBanner',      // 搜索
  getUserArticleList: ipUrl + 'getUserArticleList',   // 用户发表的文章
  getUserArticleTotal:ipUrl + 'getUserArticleTotal',  // 获取自己发的文件数量 统计

  login:              ipUrl + 'login',                // 登录
  getWeiboUserInfo:   ipUrl + 'getWeiboUserInfo',     // 获取微博登录的信息
  articleClickLike:   ipUrl + 'articleClickLike',     // 文章点赞
  getLikeStatus:      ipUrl + 'getLikeStatus',        // 查询文章点赞，联表麻烦所以分开查了
  updateUserInfo:     ipUrl + 'updateUserInfo',       // 修改用户信息
  updatePassword:     ipUrl + 'updatePassword',       // 修改密码
  updateMobile:       ipUrl + 'updateMobile',         // 修改手机号
  addEditContact:     ipUrl + 'addEditContact',       // 新增或编辑联系方式
  delContact:         ipUrl + 'delContact',           // 删除联系方式
  addEditReward:      ipUrl + 'addEditReward',        // 新增或编辑赞赏码

  getArticleComment:  ipUrl + 'getArticleComment',    // 获取评论
  setArticleComment:  ipUrl + 'setArticleComment',    // 发评论
  commentClickLike:   ipUrl + 'commentClickLike',     // 点赞评论
  getMsg:             ipUrl + 'getMsg',               // 消息通知 不分类
  getMsgList:         ipUrl + 'getMsgList',           // 消息通知 分类
  setFollow:          ipUrl + 'setFollow',            // 关注/取消关注

  getQiniuToken:      ipUrl + 'getQiniuToken',        // 获取七牛签名
  uploadQiniu:        'http://upload-z2.qiniup.com'   // 上传七牛
}


export default serviceApi;