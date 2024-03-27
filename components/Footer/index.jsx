import React, { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './style.module.less';

const toolsData = [
  {
    id: 3,
    name: 'VsCode',
    describe: '我们现在主要开发工具，懂的都懂！',
    iocn: 'http://cdn.lululuting.com/upic/vscode-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/vscode.png',
    bgColor: '#2C2C32',
    link: 'https://code.visualstudio.com/'
  },
  {
    id: 9,
    name: 'nextJs',
    describe: '目前网站主要前端框架  React和NextJS！',
    iocn: 'http://cdn.lululuting.com/upic/next-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/next.png',
    bgColor: '#fff',
    link: 'https://www.nextjs.cn/'
  },
  {
    id: 1,
    name: 'PS',
    describe: '对，我就是在用ps，你打我呀！',
    iocn: 'http://cdn.lululuting.com/upic/ps-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/ps.png',
    bgColor: '#38c8fe',
    link: 'https://www.adobe.com/cn/products/photoshop.html'
  },
  {
    id: 4,
    name: 'Ant Design',
    describe: '我们网站大量使用的UI库，Antd yyds！🙏',
    iocn: 'http://cdn.lululuting.com/upic/antd-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/antd.png',
    bgColor: '#1890ff',
    link: 'https://ant.design/index-cn'
  },
  {
    id: 5,
    name: '哔哩哔哩',
    describe: '我们文章中的所有视频都放在了B站！',
    iocn: 'http://cdn.lululuting.com/upic/bilibili-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/bilibili.png',
    bgColor: '#fb7299',
    link: 'https://www.bilibili.com/'
  },
  {
    id: 6,
    name: '网易云音乐',
    describe: '没错，左下角播放器的数据源是偷网易云音乐的！',
    iocn: 'http://cdn.lululuting.com/upic/wyyyy-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/wyyyy.png',
    bgColor: '#fff',
    link: 'https://music.163.com/'
  },
  {
    id: 2,
    name: 'Github',
    describe: '你能看到的，我们都开源在Github上了！',
    iocn: 'http://cdn.lululuting.com/upic/github.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/github-1.png',
    bgColor: '#000',
    link: 'https://github.com/lululuting/tgbk'
  },
  {
    id: 7,
    name: '码云',
    describe: '没有梯子，我们项目管理用的是码云，不是GitHub。',
    iocn: 'http://cdn.lululuting.com/upic/mayun-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/mayun.png',
    bgColor: '#40485b',
    link: 'https://gitee.com/'
  },
  {
    id: 8,
    name: '稿定设计',
    describe: '我们网站几乎所有作图都是出自稿定设计，稿定打钱！',
    iocn: 'http://cdn.lululuting.com/upic/gaoding-1.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/gaoding.png',
    bgColor: '#3260f4',
    link: 'https://gaoding.com/'
  },
  {
    id: 10,
    name: '和风天气',
    describe: '白嫖的天气数据，真香！感谢和风天气！🙏',
    iocn: 'http://cdn.lululuting.com/upic/hftq.png',
    hoverIcon: 'http://cdn.lululuting.com/upic/hftq.png',
    bgColor: '#fff',
    link: 'https://www.qweather.com/'
  }
];

const Footer = () => {
  const [active, setActive] = useState(false);

  const onMouseEnter = (id) => {
    setActive(id);
  };
  const onMouseLeave = () => {
    setActive(false);
  };

  return (
    <footer className={styles['footer']}>
      <div
        className={'wrap'}
        style={{ display: 'flex', justifyContent: 'space-around' }}
      >
        <div className={styles['footer-box']}>
          <div className={styles['left-logo']}>
            <Link href="/">
              <a>
                <img className={styles['logo']} src="/logo1.png"></img>
              </a>
            </Link>
          </div>
          <div className={styles['right-menu']}>
            <div>
              Copyright © 2023
              <Link href="/about">
                <a className={styles['logo-text']}> TGBK </a>
              </Link>
            </div>
            <div>
              <a
                className={styles['beian-a']}
                target="_blank"
                href="https://beian.miit.gov.cn/"
                rel="noreferrer"
              >
                粤ICP备2022033872号-1
              </a>
            </div>
          </div>
        </div>

        <div className={styles['tools-box']}>
          <div className={styles['inner']}>
            <div className={styles['tool-list']}>
              {toolsData.map((item) => (
                <a
                  href={item.link}
                  target="_blank"
                  className={classNames(styles['tool-item'], styles['tool-notion1'])}
                  data-color="red"
                  onMouseEnter={() => onMouseEnter(item.id)}
                  onMouseLeave={onMouseLeave}
                  key={item.id}
                  style={ active === item.id ? {backgroundColor: item.bgColor } : {}}
                  rel="noreferrer"
                >
                  <i
                    className={styles['tool-icon']}
                    style={{
                      backgroundImage: `url(${
                        active === item.id ? item.hoverIcon : item.iocn
                      })`
                    }}
                  />
                  <div className={styles['tool-desc']}>
                    <div className={styles['hide-desc']} />
                    <div
                      className={styles['inner']}
                      style={item.bgColor === '#fff' ? { color: '#333' } : null}
                    >
                      <p className={styles['name']}>{item.name}</p>
                      <p className={styles['describe']}>{item.describe}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
