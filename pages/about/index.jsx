/*
 * @Date: 2020-01-01 22:41:54
 * @LastEditors: TingGe
 * @LastEditTime: 2023-04-03 14:09:30
 * @FilePath: /ting_ge_blog/pages/about/index.jsx
 */
import React from 'react';
import Head from '@/components/Head';
import { Card, Timeline } from 'antd';
import styles from './style.module.less';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>挺哥博客-关于博客</title>
      </Head>

      <div className={styles['about-page']}>
        <Card bordered={false}>
          <p>
            <b>前言：</b>
          </p>
          Hi,你好： <br></br>
          <div style={{ textIndent: '2em' }}>
            欢迎来到
            “挺哥博客”，这里是挺哥，很高兴能在这里遇到你。正如其名，挺哥博客，是挺哥网上冲浪和记录生活的地方。本来是想做成一个个人博客当云笔记来用，写写东西，发发牢骚。后面刚好朋友也有这种笔记需求，一拍大腿干脆搞免费的多人博客平台。
            之后想法就越来越多，需求，设计，开发，维护，工作量也越来越大。因为平时也要上班，空闲的时间也不多，迭代的话全
            <b>看心情</b>
            ，不过有收到反馈的话还是很积极的。网站停停更更修修改改搞了大半年。改了很多版也重构了好多次，不满意的地方还有很多，后面要改的地方也有很多。但网站无论怎么改初衷都不会变，那就是：
            <b>分享技术，记录生活。</b>
          </div>
          <div style={{ textIndent: '2em' }}>
            希望网站的内容能帮到你，同时也欢迎提出bug和建议，分享你的想法,一起来打造你我的
            <b>冲浪记录站</b>。
          </div>
        </Card>

        <Card bordered={false}>
          <p>
            <b>规则：</b>
          </p>
          俗话说无规矩不成方圆，挺哥博客也有一台属于自己的规矩，如果你有更好的想法记得跟挺哥分享哦。我们目前的规则为：{' '}
          <br></br>
          <div>
            1.网站用户分 "网友" "普通用户" "博主" "管理员" 这4种。<br></br>
            3."网友" 不用登陆，不可以发文章，不可以 点赞 评论
            关注，只能浏览文章。<br></br>
            3."普通用户" 不可以发文章，但可以 点赞 评论 关注。<br></br>
            4."博主" 可以发文章，也可以点赞 评论 关注。<br></br>
            5."管理员"
            网站的维护者，博主的升级版，除了日常网站的更新和维护外，还可以对所有
            <b>违规的</b>文章和评论 进行删改！<br></br>
          </div>
        </Card>

        <Card bordered={false}>
          <p>
            <b>版本：</b>
          </p>
          <Timeline mode="alternate" pending="持续更新中...">
            <Timeline.Item>start 2019-12-29 🎉 项目立项 </Timeline.Item>
            <Timeline.Item>1.0 2020-01-05 🚀 版本正式上线</Timeline.Item>
            <Timeline.Item>2.0 2020-03-21 🚀 个人博主版</Timeline.Item>
            <Timeline.Item>2.1 2020-04-05 🎨 响应式改造</Timeline.Item>
            <Timeline.Item>3.0 2020-05-19 🚀 多用户版</Timeline.Item>
            <Timeline.Item>
              3.1 2020-08-12 ✨ 添加天气模块和图片预览功能
            </Timeline.Item>
            <Timeline.Item>
              3.2 2020-09-02 🐛
              修复有时候第三方的接口失灵导致播放器出错问题和优化文章阅读体验
            </Timeline.Item>
            <Timeline.Item>
              3.3 2020-09-27 💄 新增暗黑模式和天气地图
            </Timeline.Item>
            <Timeline.Item>3.4 2020-11-14 💄 新增TGFM白噪音功能</Timeline.Item>
            <Timeline.Item>
              4.0 2021-02-06 ✨ 1.代码优化，架构升级，框架和依赖更新至最新版本
              2.评论设置验证码功能。
            </Timeline.Item>
            <Timeline.Item>
              4.1 2022-02-03 ✨
              Eslint规范代码，屎山优化，架构升级，后管功能合并置前台。新增公告功能，登陆改为单点登陆。
            </Timeline.Item>
            <Timeline.Item>
              4.2 2023-04-03 ✨
              屎山优化，架构升级，主题css改造。
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </>
  );
};

export default AboutPage;
