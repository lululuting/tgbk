/*
 * @Author: TingGe
 * @Date: 2021-01-31 15:56:07
 * @LastEditTime: 2021-03-21 17:15:10
 * @LastEditors: TingGe
 * @Description: 
 * @FilePath: /github项目/tgbk/config/service.js
 */

const isProd = process.env.NODE_ENV === 'production'

const ipUrl = isProd ? 'http://xxxx.com/default/' : 'http://dev.xxxx.com/default/' // 区分环境

let serviceApi = {
  getBannerList: ipUrl + 'getBannerList', // 首页轮播图列表
  getArticleList: ipUrl + 'getArticleList', // 首页文章列表
  getArticleInfo: ipUrl + 'getArticleInfo', // 文章详细页内容
  getTypeList: ipUrl + 'getTypeList', // 列表页内容
  getUserList: ipUrl + 'getUserList', // 获取博主列表
  getUserInfo: ipUrl + 'getUserInfo', // 博主信息
  getAdvertList: ipUrl + 'getAdvertList', // 获取广告列表
  getListBanner: ipUrl + 'getListBanner', // 列表页banner
  getDetailBanner: ipUrl + 'getDetailBanner', // 详情页banner
  readingVolume: ipUrl + 'readingVolume', // 阅读量
  feedback: ipUrl + 'feedback', // 反馈
  getRewardCode: ipUrl + 'getRewardCode', // 获取赞赏码
  getSearchList: ipUrl + 'getSearchList', // 搜索页banner
  getSearchBanner: ipUrl + 'getSearchBanner', // 搜索
  getUserArticleList: ipUrl + 'getUserArticleList', // 用户发表的文章
  getUserArticleTotal: ipUrl + 'getUserArticleTotal', // 获取自己发的文件数量 统计
  login: ipUrl + 'login', // 登录
  getWeiboUserInfo: ipUrl + 'getWeiboUserInfo', // 获取微博登录的信息
  articleClickLike: ipUrl + 'articleClickLike', // 文章点赞
  getLikeStatus: ipUrl + 'getLikeStatus', // 查询文章点赞，联表麻烦所以分开查了
  updateUserInfo: ipUrl + 'updateUserInfo', // 修改用户信息
  updatePassword: ipUrl + 'updatePassword', // 修改密码
  updateMobile: ipUrl + 'updateMobile', // 修改手机号
  updateSongs: ipUrl + 'updateSongs', // 修改网易云歌单
  addEditContact: ipUrl + 'addEditContact', // 新增或编辑联系方式
  delContact: ipUrl + 'delContact', // 删除联系方式
  addEditReward: ipUrl + 'addEditReward', // 新增或编辑赞赏码
  getArticleComment: ipUrl + 'getArticleComment', // 获取评论
  setArticleComment: ipUrl + 'setArticleComment', // 发评论
  commentClickLike: ipUrl + 'commentClickLike', // 点赞评论
  getMsg: ipUrl + 'getMsg', // 消息通知 不分类
  getMsgList: ipUrl + 'getMsgList', // 消息通知 分类
  setFollow: ipUrl + 'setFollow', // 关注/取消关注
  getFollowList: ipUrl + 'getFollowList', // 获取关注列表
  getFansList: ipUrl + 'getFansList', // 获取粉丝列表
  getQiniuToken: ipUrl + 'getQiniuToken', // 获取七牛签名
  weather: ipUrl + 'getWeather', // 获取天气预报
  getMusicList: ipUrl + 'getMusicList', // 网易云歌单 (第三方扒的网易云接口经常改规则跨越啥的，干脆放到服务端请求！)
  getYitu: ipUrl + 'getYitu', // 每日一图一句 (每日一图也是经常炸，也干脆放到服务端来搞！)
  uploadQiniu: 'https://upload-z2.qiniup.com', // 上传七牛
  ipWeather: 'https://ip.help.bj.cn/', // 帮天气 ip定位+天气
}

export default serviceApi;