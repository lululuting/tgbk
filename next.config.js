// 参考 https://github.com/tientran0019/boilerplate-nextjs-antd-less
const path = require('path');
const withAntdLess = require('next-plugin-antd-less');
// const webpack = require('webpack');
// const fs = require('fs');

module.exports = withAntdLess({
  lessVarsFilePath: './public/styles/modifyVars.less',
  lessVarsFilePathAppendToEndOfContent: true,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {
    modules: {
      localIdentName: process.env.NODE_ENV !== 'production' ? '[folder]__[local]__[hash:4]' : '[hash:8]'
    }
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  pageExtensions: ['jsx', 'js', 'ts', 'tsx'],
  // 能够在页面上经过 process.env.key 获取 value。跟webpack.DefinePlugin实现的一致
  env: {
    version: '4.3'
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.lululuting.com',
      },
      {
        protocol: 'http',
        hostname: 'cdn.lululuting.com',
      },
      {
        protocol: 'http',
        hostname: 'lululuting.com',
      },
      {
        protocol: 'https',
        hostname: 'lululuting.com',
      },
      {
        protocol: 'https',
        hostname: 'lululuting.com',
      },
      {
        protocol: 'http',
        hostname: 'staticedu-wps.cache.iciba.com',
      },
      {
        protocol: 'https',
        hostname: 'staticedu-wps.cache.iciba.com',
      },
    ],
    // domains: [
    //   'dev.lululuting.com',
    //   'cdn.lululuting.com',
    //   'lululuting.com',
    //   'www.lululuting.com',
    //   'staticedu-wps.cache.iciba.com'
    // ]
  },
  // 下面两个要经过 'next/config' 来读取
  // 只有在服务端渲染时才会获取的配置
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET
  },
  // 在服务端渲染和客户端渲染均可获取的配置
  publicRuntimeConfig: {
    publicFolder: '/public'
  },
  webpack (config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      'components': path.resolve(__dirname, 'components')
    };
    return config;
  }
});
