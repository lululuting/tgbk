/*
 * @Author: TingGe
 * @Date: 2021-01-20 10:27:47
 * @LastEditTime: 2021-02-25 23:41:39
 * @LastEditors: TingGe
 * @Description: 详情页
 * @FilePath: /ting_ge_blog/pages/detail/index.jsx
 */

import React, { useState, useEffect } from 'react'
import Head from '@/components/Head'
import { Row, Col, Popover, Card, Avatar, Affix, Badge, Divider, Typography, message } from 'antd'
import classnames from 'classnames'
import { connect } from 'react-redux'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import Link from 'next/link'
import moment from 'moment'
import Cookies from 'js-cookie'
import QRCode from 'qrcode.react'
import { isLogin } from '@/public/utils/utils'
import Reward from '@/components/Reward'
import LazyImg from '@/components/LazyImg'
import Comment from '@/components/Comment'
import { PhotoSlider } from 'react-photo-view';
import Vditor from 'vditor'
import Router from 'next/router'
import {
  ProfileOutlined,
  QqOutlined,
  WeiboOutlined,
  WechatOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import './style.less'
import "vditor/dist/index.css"
import 'react-photo-view/dist/index.css';

moment.locale('zh-cn');

const { Title } = Typography

const Detail = (props) => {

  const [info, setInfo] = useState(props.articleInfo)
  const [banner, setBanner] = useState(props.banner)
  const [likeCount, setLikeCount] = useState(props.articleInfo.count)
  const [likeState, setLikeState] = useState(false)
  const [locationUrl, setLocationUrl] = useState('')
  const [visible, setVisible] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [photoImages, setPhotoImages] = React.useState([]);

  // 预览图片插件 marked.renderer retun是字符串 好像没法用jsx。 只想到挂到window这种笨方法。
  if (process.browser) {
    window.setVisible = setVisible;
    window.setPhotoIndex = setPhotoIndex;
  }

  let markdown = info ? info.content : '没有数据';

  useEffect(() => {
    props.currentArticleInfoChange(props.articleInfo); // redux 存入当前文章详情
    setLocationUrl(location.href); // 获取当前url
    // 权限校验
    if (isLogin()) {
      // 点赞状态
      getLikestatus(info.id)
    }

    // 渲染
    if (process.browser) {
      const previewElement = document.getElementById('preview')
      const outlineElement = document.getElementById('outline')

      // 大纲
      const initOutline = () => {
        const headingElements = []
        Array.from(previewElement.children).forEach((item) => {
          if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
            headingElements.push(item)
          }
        })

        let toc = []
        window.addEventListener('scroll', () => {
          const scrollTop = window.scrollY
          toc = []
          headingElements.forEach((item) => {
            toc.push({
              id: item.id,
              offsetTop: item.offsetTop,
            })
          })

          const currentElement = document.querySelector('.vditor-outline__item--current')
          for (let i = 0, iMax = toc.length; i < iMax; i++) {
            if (scrollTop < toc[i].offsetTop - 30) {
              if (currentElement) {
                currentElement.classList.remove('vditor-outline__item--current')
              }
              let index = i > 0 ? i - 1 : 0
              document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('vditor-outline__item--current')
              break
            }
          }
        })
      }

      Vditor.preview(previewElement, markdown, {
        speech: {
          enable: true, // 选中语言朗读
        },
        hljs: {
          lineNumber: true,
          style: "native",
        },
        anchor: 2, // // 为标题添加锚点 0：不渲染；1：渲染于标题前；2：渲染于标题后，默认 0
        lazyLoadImage: "//cdn.lululuting.com/upic/loading1.gif?imageslim", // 懒加载
        after: async () => {
          // 大纲
          Vditor.outlineRender(previewElement, outlineElement)
          if (outlineElement.innerText.trim() !== '') {
            outlineElement.style.display = 'block'
            initOutline()
          }
          // // 图片预览
          let imagesArr = []; // 预览图片的数组
          const imgs = previewElement.getElementsByTagName("img")

          for (let index = 0; index < imgs.length; index++) {
            imagesArr.push(imgs[index].getAttribute("data-src"))
            imgs[index].setAttribute("data-index", index)
            imgs[index].style.height = 'auto'

            imgs[index].onclick = () => {
              setVisible(true);
              setPhotoIndex(index)
            };
          }

          setPhotoImages(imagesArr); // 加载完成设置预览数组

          Vditor.codeRender(previewElement)
        },
      })
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
      if (res && res.code == 200) {
        getLikestatus(info.id)
        message.success(res.msg)
      }
    })
  }

  // 获取文章的点赞状态
  const getLikestatus = (id) => {
    request(serviceApi.getLikeStatus, {
      method: 'get',
      params: {
        id,
      }
    }).then((res) => {
      if (res && res.code == 200) {
        setLikeCount(res.data.count)
        if (res.data.status === '1') {
          setLikeState(true)
        } else {
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
        <div className="cover-box">
          <div className="b-cover">
            <LazyImg background={true} params="?imageslim" src={info?.cover} />
          </div>

          <div className="s-cover">
            <LazyImg background={true} params="?imageslim" src={info?.cover} />
          </div>
        </div>

        <div className="info">
          <Title>{info.title}</Title>

          <div className="user-nav">
            <Link href={{ pathname: '/userCenter', query: { id: info.userId } }}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar shape="square" src={info.avatar} style={{ marginRight: 10 }} />
                {info.userName}
              </div>
            </Link>

            <Divider type="vertical" />
            {moment(info.createTime).startOf('hour').fromNow()} <Divider type="vertical" />
              阅读 {info.viewCount}
            <Divider type="vertical" />
              点赞 {likeCount}
          </div>
        </div>

        <Divider />

        <Row type="flex" justify="center" id="content-box">
          <Col lg={1} xl={1} className="left-side">
            <Affix offsetTop={120}>
              <Card bodyStyle={{ padding: 0 }} title={null} bordered={false} className="left-card">

                <a onClick={clickLike} className={classnames({ 'active': likeState })}>
                  <Badge count={likeCount} >
                    <Avatar shape="square" size={28} icon={<LikeOutlined />} style={likeState ? { backgroundColor: '#ffc7ba' } : null} className={classnames("contact-icon")} />
                  </Badge>
                </a>

                <Popover placement="right" title="分享到" content={(
                  <>
                    <a href={`http://service.weibo.com/share/share.php?url=http://lululuting.com${Router.router && Router.router.asPath}?sharesource=weibo&title=${info.title}&pic=${info.cover}&appkey=2706825840`} target="_blank" style={{ marginRight: 10 }}>
                      <Avatar shape="square" size={28} icon={<WeiboOutlined />} style={{ backgroundColor: '#f9752f' }} className={classnames("contact-icon")} title="分享到微博" />
                    </a>

                    <a href={`http://connect.qq.com/widget/shareqq/index.html?url=http://lululuting.com${Router.router && Router.router.asPath}&sharesource=qzone&title=${info.title}&pics=${info.cover}&summary=${info.introduce}&desc=${info.title}`} target="_blank" style={{ marginRight: 10 }}>
                      <Avatar shape="square" size={28} icon={<QqOutlined />} style={{ backgroundColor: '#25c5fd' }} className={classnames("contact-icon")} title="分享到QQ" />
                    </a>

                    {/* 微信分享太麻烦 暂时不弄 */}
                    <a href="" target="_blank" style={{ marginRight: 10 }}>
                      <Popover placement="bottom" title="请打开微信扫一扫" content={(
                        <QRCode
                          value={locationUrl}  //value参数为生成二维码的链接
                          size={144} //二维码的宽高尺寸
                          fgColor="#000000"  //二维码的颜色
                        />
                      )} trigger="hover">
                        <Avatar shape="square" size={28} icon={<WechatOutlined />} style={{ backgroundColor: '#2bad13' }} className={classnames("contact-icon")} title="分享到微信" />
                      </Popover>
                    </a>
                  </>
                )}>
                  <Avatar shape="square" size={28} icon={<ShareAltOutlined />} className={classnames("contact-icon share")} />
                </Popover>

              </Card>
            </Affix>
          </Col>

          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <div className="content-box">
              <div className="detailed-content">
                {/* <div dangerouslySetInnerHTML={{ __html: parser(html) }} ></div> */}
                <div id="preview"></div>

                <Reward userId={info && info.userId ? info.userId : null} />
              </div>
              <Comment props={{ auid: info.userId }} />
            </div>
          </Col>

          <Col xs={0} sm={0} md={0} lg={5} xl={5} style={{ paddingRight: 10 }}>
            {/* <If condition={tocify.tocItems && tocify.tocItems.length}> */}
            <Affix offsetTop={120}>
              <div className="detailed-nav comm-box">
                <div className="nav-title">
                  <ProfileOutlined type="read" style={{ marginRight: 10 }} /> 目录
                  </div>
                <div className="toc-list" style={{ maxHeight: 500, overflowY: 'auto' }} id="outline"></div>
              </div>
            </Affix>
            {/* </If> */}
          </Col>
        </Row>
      </div>

      <PhotoSlider
        images={photoImages.map(item => ({ src: item }))}
        visible={visible}
        onClose={() => setVisible(false)}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
    </>
  )
}


export async function getServerSideProps(context) {

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

  return { props: { articleInfo, banner } }
}

const dispatchToProps = (dispatch) => {
  return {
    currentArticleInfoChange(obj) {
      let action = {
        type: 'changeCurrentArticleInfo',
        payload: obj
      }
      dispatch(action)
    }
  }
}

export default connect(null, dispatchToProps)(Detail)
