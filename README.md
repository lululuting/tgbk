## 简介

tgbk 项目为 `主站`和`接口服务` 这个两个。

前台项目 技术栈为 `react` + `antd5` + `nextJS12x` + `react-redux` ssr 服务端渲染
静态资源 采用 `七牛云cdn`进行加速
网友登录 采用`微博sdk`进行授权注册登录
[线上地址](http://lululuting.com "线上地址")

## 网站效果截图

![cover](https://github.com/lululuting/pic/blob/master/preview/tgbk%E6%95%88%E6%9E%9C%E5%9B%BE.jpeg)

### 目录架构

```
├─components  // 组件
│  ├─Aplayer
│  │      index.js
│  │      style.scss
│  │
│  └─UpInfo
│          index.js
│          style.scss
│
├─config
│      service.js // 接口配置
│      index.js // 配置文件
│
├─pages // 页面
│  │  _app.js
│  │
│  └─userCenter
│          index.js
│          style.scss
│
├─public
│  │  favicon.ico
│  │
│  ├─style
│  │      global.scss
│  │      modifyVars.scss // 主题配置
│  │
│  └─utils
│          request.js // umi-request 请求库
│          uploadQiniu.js // 上传牛云方法
│          utils.js // 公共类库
│
└─store
        index.js
        reducer.js
.babelrc
.gitignore
next.config.js // 配置文件
package.json
README.en.md
README.md
```

### 准备

- 七牛云 微博 百度定位 天气接口，相关的服务都需要你来重新配置密钥和地址。
- 前台依赖于接口服务，运行前台项目前请确保接口服务正常开启。

### 运行

本地开发环境 `npm run install 后 npm run dev`

线上生成环境

```
初始化
npm run install

打包
npm run build

再用pm2守护
pm2 start npm --name="blog" -- run start'
```


