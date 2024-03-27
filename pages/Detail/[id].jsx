/*
 * @Author: TingGe
 * @Date: 2021-01-20 10:27:47
 * @LastEditTime: 2023-06-14 15:16:26
 * @LastEditors: TingGe
 * @Description: 详情页
 * @FilePath: /ting_ge_blog/pages/detail/[id].jsx
 */

import React, { useState, useEffect } from 'react';
import Head from '@/components/Head';
import {
  Row,
  Col,
  Popover,
  Card,
  Avatar,
  Affix,
  Badge,
  Divider,
  Typography,
  message
} from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import Link from 'next/link';
import moment from 'moment';
import Cookies from 'js-cookie';
import QRCode from 'qrcode.react';
import { isLogin } from '@/public/utils/utils';
import Reward from '@/components/Reward';
import LazyImg from '@/components/LazyImg';
import { PhotoSlider } from 'react-photo-view';
import Vditor from 'vditor';
import Router from 'next/router';
import {
  ProfileOutlined,
  QqOutlined,
  WeiboOutlined,
  WechatOutlined,
  LikeOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import dynamic from "next/dynamic"
import styles from './style.module.less';
import 'vditor/dist/index.css';
import 'react-photo-view/dist/index.css';

moment.locale('zh-cn');

const Comment = dynamic(import("./comment"), { ssr: false });
const { Title } = Typography;

const Detail = (props) => {
  const [info] = useState(props.articleInfo);
  const [likeCount, setLikeCount] = useState(props.articleInfo.likeCount);
  const [likeState, setLikeState] = useState(false);
  const [locationUrl, setLocationUrl] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [photoImages, setPhotoImages] = React.useState([]);

  // 预览图片插件 marked.renderer return是字符串 好像没法用jsx。 只想到挂到window这种笨方法。
  if (process.browser) {
    window.setVisible = setVisible;
    window.setPhotoIndex = setPhotoIndex;
  }

  let markdown = info ? info.content : '没有数据';

  // 获取文章的点赞状态
  const getLikeStatus = (id) => {
    request(serviceApi.getLikeStatus, {
      method: 'get',
      params: {
        id
      }
    }).then((res) => {
      if (res && res.code == 200) {
        setLikeCount(res.data.count);
        if (res.data.status) {
          setLikeState(true);
        } else {
          setLikeState(false);
        }
      }
    });
  };

  useEffect(() => {
    props.currentArticleInfoChange(props.articleInfo); // redux 存入当前文章详情
    setLocationUrl(location.href); // 获取当前url
    // 权限校验
    if (isLogin()) {
      // 点赞状态
      getLikeStatus(info.id);
    }

    // 渲染
    if (process.browser) {
      const previewElement = document.getElementById('preview');
      const outlineElement = document.getElementById('outline');

      // 大纲
      const initOutline = () => {
        const headingElements = [];
        _.forEach(Array.from(previewElement.children, (item) => {
          if (
            item.tagName.length === 2 &&
            item.tagName !== 'HR' &&
            item.tagName.indexOf('H') === 0
          ) {
            headingElements.push(item);
          }
        }));

        // 给目录初始化样式并添加title
        document
          .querySelector('#outline ul li > span')
          .classList.add('vditor-outline__item--current');

        const arrayList = Array.from(
          document.querySelectorAll('#outline ul li > span')
        );
        // 设置title
        for (let i = 0; i < arrayList.length; i++) {
          arrayList[i].setAttribute('title', arrayList[i].innerText);
        }

        let toc = [];
        window.addEventListener('scroll', () => {
          const scrollTop = window.scrollY;
          toc = [];
          _.forEach(headingElements, (item) => {
            toc.push({
              id: item.id,
              offsetTop: item.offsetTop
            });
          });

          let flag = 0; // 防止执行多次添加标识
          if (toc.length !== 0 && flag === 0) {
            flag++;
            let flagHeight = toc[toc.length - 1].offsetTop * 2;
            let lastChildpro = { id: '尾部添加高度', offsetTop: flagHeight }; // 尾部添加高度防止底部标签无法选取
            toc.push(lastChildpro);
          }

          const currentElement = document.querySelector(
            '.vditor-outline__item--current'
          );
          for (let i = 0, iMax = toc.length; i < iMax; i++) {
            if (scrollTop < toc[i].offsetTop - 30) {
              if (currentElement) {
                currentElement.classList.remove(
                  'vditor-outline__item--current'
                );
              }
              let index = i > 0 ? i - 1 : 0;
              document.querySelector(
                'span[data-target-id="' + toc[index].id + '"]'
              ) &&
                document
                  .querySelector('span[data-target-id="' + toc[index].id + '"]')
                  .classList.add('vditor-outline__item--current');
              break;
            }
          }
        });
      };

      Vditor.preview(previewElement, markdown, {
        speech: {
          enable: true // 选中语言朗读
        },
        hljs: {
          lineNumber: true,
          style: 'native'
        },
        anchor: 2, // // 为标题添加锚点 0：不渲染；1：渲染于标题前；2：渲染于标题后，默认 0
        lazyLoadImage: '//cdn.lululuting.com/upic/loading1.gif?imageslim', // 懒加载
        after: async () => {
          // 大纲
          Vditor.outlineRender(previewElement, outlineElement);
          if (outlineElement.innerText.trim() !== '') {
            outlineElement.style.display = 'block';
            initOutline();
          }
          // // 图片预览
          let imagesArr = []; // 预览图片的数组
          const imgs = previewElement.getElementsByTagName('img');

          for (let index = 0; index < imgs.length; index++) {
            imagesArr.push(imgs[index].getAttribute('data-src'));
            imgs[index].setAttribute('data-index', index);
            imgs[index].style.height = 'auto';

            imgs[index].onclick = () => {
              setVisible(true);
              setPhotoIndex(index);
            };
          }

          setPhotoImages(imagesArr); // 加载完成设置预览数组

          Vditor.codeRender(previewElement);
        }
      });
    }

    // 浏览量规则 30分钟内算一次浏览量（不严谨仅前端处理）
    // 1，存cookie, 过期时间30分钟。 key为 文章id 唯一
    // 2, 检查cookie有没有 没有加一，有则不作处理
    if (!Cookies.get(info.id)) {
      request(serviceApi.readingVolume, {
        method: 'get',
        params: {
          id: info.id
        }
      }).then((res) => {
        if (res?.code === 200) {
          Cookies.set(info.id, '123', {
            expires: new Date(new Date().getTime() + (60 * 60 * 1000) / 2)
          });
        }
      });
    }
  }, []);

  // 文章点赞
  const clickLike = () => {
    // 权限校验
    if (!isLogin()) {
      message.warning('游客暂不开放点赞功能，请先登录！');
      return false;
    }

    request(serviceApi.articleClickLike, {
      params: {
        id: info.id
      }
    }).then((res) => {
      if (res && res.code == 200) {
        getLikeStatus(info.id);
        message.success(res.msg);
      }
    });
  };

  return (
    <>
      <Head>
        <title>{info.title}-挺哥博客</title>
      </Head>

      <div className={styles['detail-box']}>
        <div className={styles['cover-box']}>
          <div className={styles['b-cover']}>
            <LazyImg background params="?imageslim" src={info?.cover} />
          </div>

          <div className={styles['s-cover']}>
            <LazyImg background params="?imageslim" src={info?.cover} />
          </div>
        </div>

        <div className={styles['info']}>
          <Title className={styles['article-title']}>{info.title}</Title>

          <div className={styles['user-nav']}>
            <Link href="/userCenter/[id]" as={`/userCenter/${info?.user?.id}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <Avatar
                  shape="square"
                  src={info?.user?.avatar}
                  style={{ marginRight: 10 }}
                />
                {info?.user?.userName}
              </div>
            </Link>
            <Divider type="vertical" />
            {moment(info.createTime).startOf('hour').fromNow()}
            <Divider type="vertical" />
            阅读 {info.viewCount}
            <Divider type="vertical" />
            点赞 {likeCount}
          </div>
        </div>

        <Divider />

        <Row type="flex" justify="center" id="content-box">
          <Col lg={1} xl={1} className={styles['left-side']}>
            <Affix offsetTop={120}>
              <Card
                title={null}
                bordered={false}
                className={styles['left-card']}
              >
                <a
                  onClick={clickLike}
                  className={classnames({ [styles['active']]: likeState })}
                >
                  <Badge count={likeCount}>
                    <Avatar
                      shape="square"
                      size={28}
                      icon={<LikeOutlined />}
                      style={likeState ? { backgroundColor: '#ff5555' } : null}
                      className={styles['contact-icon']}
                    />
                  </Badge>
                </a>

                <Popover
                  placement="right"
                  title="分享到"
                  overlayClassName={styles['share-to']}
                  content={
                    <>
                      <a
                        href={`http://service.weibo.com/share/share.php?url=http://lululuting.com${
                          Router.router && Router.router.asPath
                        }?sharesource=weibo&title=${info.title}&pic=${
                          info.cover
                        }&appkey=2706825840`}
                        target="_blank"
                        style={{ marginRight: 10 }}
                        rel="noreferrer"
                      >
                        <Avatar
                          shape="square"
                          size={28}
                          icon={<WeiboOutlined />}
                          style={{ backgroundColor: '#f9752f' }}
                          className={styles['contact-icon']}
                          title="分享到微博"
                        />
                      </a>

                      <a
                        href={`http://connect.qq.com/widget/shareqq/index.html?url=http://lululuting.com${
                          Router.router && Router.router.asPath
                        }&sharesource=qzone&title=${info.title}&pics=${
                          info.cover
                        }&summary=${info.introduce}&desc=${info.title}`}
                        target="_blank"
                        style={{ marginRight: 10 }}
                        rel="noreferrer"
                      >
                        <Avatar
                          shape="square"
                          size={28}
                          icon={<QqOutlined />}
                          style={{ backgroundColor: '#25c5fd' }}
                          className={styles['contact-icon']}
                          title="分享到QQ"
                        />
                      </a>

                      {/* 微信分享太麻烦 暂时不弄 */}
                      <a href="" target="_blank" style={{ marginRight: 10 }}>
                        <Popover
                          placement="bottom"
                          overlayClassName={styles['qr-code']}
                          title="请打开微信扫一扫"
                          content={
                            <QRCode
                              value={locationUrl} // value参数为生成二维码的链接
                              size={144} // 二维码的宽高尺寸
                              fgColor="#000000" // 二维码的颜色
                            />
                          }
                          trigger="hover"
                        >
                          <Avatar
                            shape="square"
                            size={28}
                            icon={<WechatOutlined />}
                            style={{ backgroundColor: '#2bad13' }}
                            className={styles['contact-icon']}
                            title="分享到微信"
                          />
                        </Popover>
                      </a>
                    </>
                  }
                >
                  <Avatar
                    shape="square"
                    size={28}
                    icon={<ShareAltOutlined />}
                    className={classnames(styles['contact-icon'], styles['share'])}
                  />
                </Popover>
              </Card>
            </Affix>
          </Col>

          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <div className={styles['content-box']}>
              <div className={styles['detailed-content']}>
                {/* <div dangerouslySetInnerHTML={{ __html: parser(html) }} ></div> */}
                <div id="preview"></div>

                <Reward userId={info && info.userId ? info.userId : null} />
              </div>
              <Comment props={{ auid: info.userId }} />
            </div>
          </Col>

          <Col xs={0} sm={0} md={0} lg={5} xl={5}
            style={{ paddingRight: 10 }}
          >
            <Affix offsetTop={120}>
              <div className={classnames(styles['detailed-nav'], styles['comm-box'])}>
                <div className={styles['nav-title']}>
                  <ProfileOutlined type="read" style={{ marginRight: 10 }} />{' '}
                  目录
                </div>
                <div
                  className={styles['toc-list']}
                  style={{ maxHeight: 500, overflowY: 'auto' }}
                  id="outline"
                ></div>
              </div>
            </Affix>
          </Col>
        </Row>
      </div>

      <PhotoSlider
        images={photoImages.map((item) => ({ src: item }))}
        visible={visible}
        onClose={() => setVisible(false)}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
    </>
  );
};

export async function getServerSideProps (context) {
  const promise = new Promise((resolve) => {
    request(serviceApi.getArticleInfo, {
      params: { id: context.query.id },
      // 文章请求 需要传Cookie给后台判断 是否登陆 是否超管 是否自己
      requestProps: {
        headers: {
          Cookie: context.req?.headers?.cookie
        }
      }
    }).then((res) => {
      resolve(res.data);
    });
  });

  const promise1 = new Promise((resolve) => {
    request(serviceApi.getDetailBanner).then((res) => {
      resolve(res.data);
    });
  });

  let articleInfo = await promise;
  let banner = await promise1;

  return { props: { articleInfo, banner } };
}

const dispatchToProps = (dispatch) => {
  return {
    currentArticleInfoChange (obj) {
      let action = {
        type: 'changeCurrentArticleInfo',
        payload: obj
      };
      dispatch(action);
    }
  };
};

export default connect(null, dispatchToProps)(Detail);
