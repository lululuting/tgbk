/*
 * @Date: 2020-01-03 21:43:34
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-04-16 21:51:19
 * @FilePath: \ting_ge_blog\pages\detail\index.js
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import { Row, Col, Icon, Popover, Card, Avatar, Affix, Badge, Divider, Typography, message } from 'antd'
import classnames from 'classnames'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import Link from 'next/link'
import moment from 'moment'
import Cookies from 'js-cookie'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import './style.less'

import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import renderMathInElement from '@/public/utils/autorender.js'

import { isLogin } from '@/public/utils/utils'
import Tocify from '@/components/Tocify/index.tsx'
import Reward from '@/components/Reward'
import LazyImg from '@/components/LazyImg'

import Comment from '@/components/Comment'

// import dynamic from 'next/dynamic'
// const Comment = dynamic(import('@/components/Comment'), { ssr: false })

import Router from 'next/router'
moment.locale('zh-cn');

const { Title } = Typography

const Detail = (porps) => {

  const tocify = new Tocify();
  const renderer = new marked.Renderer();

  // 标题
  renderer.heading = function (text, level, raw) {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
  };

  marked.setOptions({
    renderer, // 这个是必须填写的，你可以通过自定义的 style={{marginRight:10}}Renderer渲染出自定义的格式
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  })

  hljs.configure({ useBR: true });


  const [info, setInfo] = useState(porps.articleInfo)
  const [banner, setBanner] = useState(porps.banner)
  const [likeCount, setLikeCount] = useState(porps.articleInfo.count)
  const [likeState, setLikeState] = useState(false)

  let markdown = info ? info.content : '没有数据';

  let html = marked(markdown)

  useEffect(() => {
    // 权限校验
    if (isLogin()) {
      // 点赞状态
      getLikestatus(info.id)
    }
    
    // 公式渲染
    if (process.browser) {
      document.onload = renderMathInElement(document.body,
        {
          delimiters: [
            { left: "$$", right: "$$", display: "block" },
            { left: "$", right: "$", display: "inblock" }
          ]
        }
      );
    }


    // 浏览量规则 
    // 1，存cookie, 过期时间30分钟。 key为 文章id 唯一
    // 2, 检查cookie有没有 没有加一，有则不作处理
    if (!Cookies.get(info.id)) {
      request(serviceApi.readingVolume, {
        method: 'get',
        params: {
          id: info.id
        }
      }).then((res) => {
        if (res.code == 200) {
          Cookies.set(info.id, '123', { expires: new Date(new Date().getTime() + (60 * 60 * 1000) / 2) });
        }
      })
    }
  }, [])


  // 文章点赞
  const clickLike = () => {
    // 权限校验
    if (!isLogin()) {
      message.warning('靓仔，请先登录哦！')
      return false
    }
    
    request(serviceApi.articleClickLike, {
      method: 'get',
      params: {
        id: info.id,
      }
    }).then((res) => {
      if(res && res.code == 200){
        getLikestatus(info.id)
        message.success(res.msg)
      }
    })
  }
  
  // 获取文章的点赞状态
  const getLikestatus = (id) =>{
    request(serviceApi.getLikeStatus, {
      method: 'get',
      params: {
        id,
      }
    }).then((res) => {
      if(res && res.code == 200){
          setLikeCount(res.data.count)
        if(res.data.status === '1'){
          setLikeState(true)
        }else{
          setLikeState(false)
        }
      }
    })
  }

  return (
    <>
      <Head>
        <title>{info.title}-挺哥博客</title>
      </Head>

      <div className="detail-box">
        <div className="banner">
          <LazyImg background={true} params="?imageslim" src={banner && banner.url && banner.url} />
        </div>

        <div className="info">
          <Title>{info.title}</Title>

          <div className="user-nav">
            <Link href={{ pathname: '/userCenter', query: { id: info.userId } }}>
              <a style={{ color: '#333', display: 'flex', alignItems: 'center' }}>
                <Avatar src={info.avatar} style={{ marginRight: 5 }} />
                {info.userName}
              </a>
            </Link>

            <Divider type="vertical" />
            {moment(info.createTime).startOf('hour').fromNow()} <Divider type="vertical" />
              阅读 {info.viewCount}
            <Divider type="vertical" />
              点赞 {likeCount}
          </div>
        </div>

        <Divider />

        <Row type="flex" justify="center">
          <Col lg={1} xl={1} className="left-side">
            <Affix offsetTop={120}>
              <Card bodyStyle={{ padding: 0 }} title={null} bordered={false} className="left-card">

                <a onClick={clickLike} className={classnames({ 'active': likeState })}>
                  <Badge count={likeCount} >
                    <Avatar shape="square" size={28} icon="like" style={likeState ? { backgroundColor: '#ffc7ba' } : null} className={classnames("contact-icon")} />
                  </Badge>
                </a>

                <Popover placement="right" title="分享到" content={(
                  <>
                    <a href={`http://service.weibo.com/share/share.php?url=http://lululuting.com${Router.router && Router.router.asPath}?sharesource=weibo&title=${info.title}&pic=${info.cover}&appkey=2706825840`} target="_blank" style={{ marginRight: 10 }}>
                      <Avatar shape="square" size={28} icon="weibo-circle" style={{ backgroundColor: '#f9752f' }} className={classnames("contact-icon")} title="分享到微博" />
                    </a>

                    <a href={`http://connect.qq.com/widget/shareqq/index.html?url=http://lululuting.com${Router.router && Router.router.asPath}&sharesource=qzone&title=${info.title}&pics=${info.cover}&summary=${info.introduce}&desc=${info.title}`} target="_blank" style={{ marginRight: 10 }}>
                      <Avatar shape="square" size={28} icon="qq" style={{ backgroundColor: '#25c5fd' }} className={classnames("contact-icon")} title="分享到QQ" />
                    </a>

                    {/* 微信太麻烦 暂时不弄 */}
                    {/* <a href="" target="_blank" style={{ marginRight: 10 }}>
                        <Avatar shape="square" size={28} icon="wechat" style={{ backgroundColor: '#2bad13' }} className={classnames("contact-icon")} title="分享到微信" />
                      </a> */}

                  </>
                )}>
                  <Avatar shape="square" size={28} icon="share-alt" className={classnames("contact-icon share")} />
                </Popover>

              </Card>
            </Affix>
          </Col>
          

          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <div className="content-box">
              <div className="detailed-content">
                <div dangerouslySetInnerHTML={{ __html: html }} ></div>
                <Reward userId={info && info.userId ? info.userId : null} />
              </div>
            
              <Comment props={{ auid: info.userId}} />
            </div>
          </Col>

          <Col xs={0} sm={0} md={0} lg={5} xl={5} style={{ paddingRight: 10 }}>
            {
              tocify && tocify.tocItems && tocify.tocItems.length
                ?
                <Affix offsetTop={120}>
                  <div className="detailed-nav comm-box">
                    <div className="nav-title">
                      <Icon type="read" style={{ marginRight: 10 }} />
                        目录
                      </div>
                    <div className="toc-list" style={{ maxHeight: 500, overflowY: 'auto' }}>
                      {tocify && tocify.render()}
                    </div>
                  </div>
                </Affix> : null
            }
          </Col>
        </Row>
      </div>
    </>
  )
}


Detail.getInitialProps = async (context) => {

  const promise = new Promise((resolve) => {
    request(serviceApi.getArticleInfo, {
      method: 'get',
      params: { id: context.query.id }
    }).then((res) => {
      resolve(res.data[0])
    })
  })

  const promise1 = new Promise((resolve) => {
    request(serviceApi.getDetailBanner).then((res) => {
      resolve(res.data[0])
    })
  })

  let articleInfo = await promise
  let banner = await promise1

  return { articleInfo, banner }
}




export default Detail

