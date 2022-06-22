## 简介

tgbk 项目为 `前台主站` `后台管理系统`还有`api接口服务` 这个三个。

[线上地址](http://lululuting.com "线上地址")（最新代码还在本地。还没上传。懒）

## 前台主站

![cover](http://cdn.lululuting.com/upic/WX20210321-182555@2x.png)

前台项目 技术栈为 `react` + `antd` + `next` + `react-redux` ssr 服务端渲染
静态资源 采用 `七牛云cdn`进行加速
游客登录 采用`微博sdk`进行授权注册登录

### 目录架构

```
├─components  // 组件
│  ├─Aplayer
│  │      index.js
│  │      style.less
│  │
│  └─UpInfo
│          index.js
│          style.less
│
├─config
│      service.js // 接口配置
│      weibo.js // 微博sdk配置
│
├─pages // 页面
│  │  _app.js
│  │
│  ├─Detail
│  │      index.js
│  │      md.less
│  │      style.less
│  │
│  ├─index
│  │      index.js
│  │      style.less
│  │
│  ├─List
│  │      index.js
│  │      style.less
│  │
│  ├─msgCenter
│  │      index.js
│  │      style.less
│  │
│  ├─search
│  │      index.js
│  │      style.less
│  │
│  └─userCenter
│          index.js
│          style.less
│
├─public
│  │  favicon.ico
│  │  favicon1.ico
│  │
│  ├─style
│  │      global.less
│  │      modifyVars.less // 主题配置
│  │
│  └─utils
│          request.js // umi-request 请求库
│          uploadQiniu.js // 上传牛云方法
│          utils.js // 公共类库
│
├─static
│      logo.png
│      logo1.png
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
uploadCnd.js // 打包后一健上传七牛云 配好参数打包后 npm run cdn
deploy.js // 自动化部署插件配置
tsconfig.json // ts配置文件
```

### 运行

本地开发环境 `npm run install 后 npm run dev`
线上生成环境

```
npm run install
npm run build
pm2 start npm --name="blog" -- run start'
```

### 可能发生的一些问题

- 七牛云和微博相关的服务都需要你来重新配置密钥和地址
- 前台依赖于 api 接口服务，运行前台项目前 请确保 api 接口服务已开启
